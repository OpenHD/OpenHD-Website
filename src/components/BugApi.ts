import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
export type BugEntry = { id: number; number: number; title: string; body?: string; state: string; html_url: string; updated_at: string; repository_url: string; pull_request?: {merged_at?: string}; merged?: boolean; labels: {name: string}[]; related?: BugEntry[] };
export function useBugApi() {
  const {siteConfig} = useDocusaurusContext();
  const endpoint = String(siteConfig.customFields?.bugReportApiUrl || '').replace(/\/$/, '');
  return endpoint.startsWith('https://') ? endpoint : '';
}
export function entryType(entry: BugEntry) { return entry.pull_request ? 'Pull Request' : entry.labels.some(label => label.name === 'website-report') ? 'Bug' : 'GitHub Issue'; }
export function labelValue(entry: BugEntry, prefix: string) { return entry.labels.find(label => label.name.startsWith(`${prefix}:`))?.name.slice(prefix.length + 1) || '—'; }
export async function bugFetch(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  const result = await response.json();
  if (!response.ok) {const error = new Error((result.message || 'The tracker is temporarily unavailable.') + (response.headers.get('Retry-After') ? ` Retry in ${response.headers.get('Retry-After')} seconds.` : '')); Object.assign(error, {status: response.status}); throw error;}
  return result;
}
