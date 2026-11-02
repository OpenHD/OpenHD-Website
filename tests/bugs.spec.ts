import {test, expect, type Page} from '@playwright/test';

async function mocks(page: Page, enabled = true) {
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.fulfill({contentType: 'application/javascript', body: 'window.turnstile={render:(el,o)=>{el.textContent="Verification complete";setTimeout(()=>o.callback("verified"),0);return "widget";},remove:()=>{},reset:()=>{}};'}));
  await page.route('https://openhd.tech/api/bugs**', async route => {
    const req = route.request(), url = new URL(req.url());
    const headers = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'X-Bug-Token, Content-Type', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'};
    if (req.method() === 'OPTIONS') return route.fulfill({status: 204, headers});
    let result: unknown;
    if (url.pathname.endsWith('/config')) result = {enabled, maxArchiveBytes: 52428800, components: ['video', 'radio'], turnstileSiteKey: 'test-site'};
    else if (url.pathname.endsWith('/challenge')) result = {token: 'test-token'};
    else if (url.pathname.endsWith('/submission')) result = {id: 'report', number: 42, status: 'created', url: 'https://github.com/OpenHD/OpenHD/issues/42', message: 'Bug report created. Notification queued.'};
    else if (req.method() === 'POST') {
      const body = req.postDataBuffer()?.toString() || '';
      expect(body).toContain('name="air_logs"'); expect(body).toContain('name="ground_logs"'); expect(body).toContain('name="steps"');
      result = {id: 'report', number: 42, status: 'created', url: 'https://github.com/OpenHD/OpenHD/issues/42', message: 'Bug report created. Notification queued.'};
    } else if (url.pathname.includes('/entry/')) result = {id: 1, number: 42, title: 'Camera fails', body: 'Steps: boot the unit. <script>unsafe()</script>', state: 'open', html_url: 'https://github.com/OpenHD/OpenHD/issues/42', updated_at: '2026-11-02T10:00:00Z', repository_url: 'https://api.github.com/repos/OpenHD/OpenHD', labels: [{name: 'website-report'}, {name: 'component:video'}]};
    else result = {total_count: 70, items: [{id: 1, number: 42, title: 'Camera fails', state: 'open', html_url: 'https://github.com/OpenHD/OpenHD/issues/42', updated_at: '2026-11-02T10:00:00Z', repository_url: 'https://api.github.com/repos/OpenHD/OpenHD', labels: [{name: 'website-report'}, {name: 'component:video'}]}, {id: 2, number: 43, title: 'Fix camera', state: 'closed', html_url: 'https://github.com/OpenHD/OpenHD/pull/43', updated_at: '2026-11-02T10:00:00Z', repository_url: 'https://api.github.com/repos/OpenHD/OpenHD', labels: [], pull_request: {merged_at: '2026-11-02T10:00:00Z'}}]};
    if (url.pathname === '/api/bugs' && req.method() === 'GET') {
      const list = result as {items: unknown[]};
      const baseEntry = {updated_at: '2026-11-02T10:00:00Z', repository_url: 'https://api.github.com/repos/OpenHD/OpenHD', labels: []};
      list.items.push(
        {...baseEntry, id: 3, number: 44, title: 'Radio issue', state: 'open', html_url: 'https://github.com/OpenHD/OpenHD/issues/44'},
        {...baseEntry, id: 4, number: 45, title: 'Radio fix', state: 'open', html_url: 'https://github.com/OpenHD/OpenHD/pull/45', pull_request: {}},
        {...baseEntry, id: 5, number: 46, title: 'Old website report', state: 'closed', html_url: 'https://github.com/OpenHD/OpenHD/issues/46', labels: [{name: 'website-report'}]},
      );
    }
    return route.fulfill({json: result, headers});
  });
}

test('normal report requires all fields and both archives before submission', async ({page}, info) => {
  await mocks(page); await page.goto('/bugs/report');
  const submit = page.getByRole('button', {name: 'Submit bug report'}); await expect(submit).toBeDisabled();
  await page.getByLabel('Bug title *', {exact: true}).fill('Camera fails');
  await page.getByLabel('Description *', {exact: true}).fill('Video stops after boot');
  await page.getByLabel('Steps to reproduce *', {exact: true}).fill('Boot and observe camera');
  await page.getByLabel('OpenHD version *', {exact: true}).fill('2.7');
  await page.getByLabel('Air hardware *', {exact: true}).fill('Pi 4');
  await page.getByLabel('Ground hardware *', {exact: true}).fill('Pi 5');
  await page.getByLabel(/^Affected component/).selectOption('video');
  await page.getByLabel(/^Air Unit diagnostic archive/).setInputFiles({name: 'air.zip', mimeType: 'application/zip', buffer: Buffer.from('fixture')});
  await expect(submit).toBeDisabled();
  await page.getByLabel(/^Ground Unit diagnostic archive/).setInputFiles({name: 'ground.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('fixture')});
  await expect(submit).toBeDisabled();
  await page.getByLabel(/^Ground Unit diagnostic archive/).setInputFiles({name: 'ground.tgz', mimeType: 'application/gzip', buffer: Buffer.from('fixture')});
  await expect(submit).toBeEnabled(); await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true); await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({path: info.outputPath('report.png'), fullPage: true});
  await submit.click(); await expect(page.getByRole('heading', {name: 'Bug #42 created'})).toBeVisible(); await expect(page.getByRole('link', {name: 'View your issue on GitHub'})).toHaveAttribute('href', 'https://github.com/OpenHD/OpenHD/issues/42');
});
test('tracker shows open reports, optionally includes GitHub activity, and paginates details', async ({page}, info) => {
  await mocks(page); await page.goto('/bugs'); await expect(page.getByRole('link', {name: '#42 Camera fails'})).toBeVisible();
  await expect(page.getByLabel('Show GitHub issues and pull requests')).toHaveValue('no');
  await expect(page.getByRole('link', {name: '#43 Fix camera'})).toHaveCount(0);
  await expect(page.getByRole('link', {name: '#44 Radio issue'})).toHaveCount(0);
  await expect(page.getByRole('link', {name: '#45 Radio fix'})).toHaveCount(0);
  await expect(page.getByRole('link', {name: '#46 Old website report'})).toHaveCount(0);
  const request = page.waitForRequest(r => {const url = new URL(r.url()); return url.pathname === '/api/bugs' && url.searchParams.get('type') === 'all' && url.searchParams.get('status') === 'open';});
  await page.getByLabel('Show GitHub issues and pull requests').selectOption('yes'); await request;
  await expect(page.getByRole('link', {name: '#44 Radio issue'})).toBeVisible();
  await expect(page.getByRole('link', {name: '#45 Radio fix'})).toBeVisible();
  await expect(page.getByRole('link', {name: '#43 Fix camera'})).toHaveCount(0);
  await expect(page.getByRole('link', {name: '#46 Old website report'})).toHaveCount(0);
  await page.getByRole('button', {name: 'Next', exact: true}).click(); await expect(page.getByText('Page 2 of 3')).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true); await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({path: info.outputPath('tracker.png'), fullPage: true});
  const reportsOnly = page.waitForRequest(r => {const url = new URL(r.url()); return url.pathname === '/api/bugs' && url.searchParams.get('type') === 'bug' && url.searchParams.get('status') === 'open' && url.searchParams.get('page') === '1';});
  await page.getByLabel('Show GitHub issues and pull requests').selectOption('no'); await reportsOnly;
  await expect(page.getByRole('link', {name: '#44 Radio issue'})).toHaveCount(0);
  await expect(page.getByRole('link', {name: '#45 Radio fix'})).toHaveCount(0);
  await page.getByRole('link', {name: '#42 Camera fails'}).click(); await expect(page.getByRole('heading', {name: '#42 Camera fails'})).toBeVisible();
  await expect(page.getByText('Steps: boot the unit. <script>unsafe()</script>', {exact: true})).toBeVisible(); await expect(page.getByRole('heading', {name: 'Diagnostic files'})).toBeVisible();
});
test('disabled backend cannot accept reports', async ({page}) => {await mocks(page, false); await page.goto('/bugs/report'); await expect(page.getByText('Submissions are awaiting server configuration. Please try again later.')).toBeVisible(); await expect(page.getByRole('button', {name: 'Submit bug report'})).toBeDisabled();});
test('incomplete diagnostics require an explanation and explicitly request maintainer review', async ({page}) => {
  await mocks(page); await page.goto('/bugs/report'); await page.getByLabel('Exceptional case: a unit cannot boot, so diagnostics are unavailable').check();
  await expect(page.getByText('Incomplete diagnostics — maintainer review required', {exact: true})).toBeVisible(); await expect(page.getByLabel('Which unit cannot boot, and why can you not obtain its logs? *')).toBeVisible(); await expect(page.getByRole('button', {name: 'Submit for maintainer review'})).toBeDisabled();
});
