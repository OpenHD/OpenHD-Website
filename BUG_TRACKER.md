# Unified OpenHD bug tracker

The website uses `https://openhd.tech/api/bugs` by default. Set `BUG_REPORT_API_URL` at build time to change it. No credentials belong in the website. This extends PR #12; FleetControl owns the backend, so the unused Python requirements are removed.

`/bugs` supports search, type, status, repository and component filters with server pagination. GitHub search caps results at 1,000; narrow filters for older results. GitHub data is cached for one minute, with rate-limit backoff. `/bugs/detail?repo=OpenHD/OpenHD&number=123` shows descriptions as escaped text, metadata, related pull requests and the original link.

`/bugs/report` requires title, description, reproduction steps, version, component, Air hardware, Ground hardware, and both archives. ZIP, tar.gz and tgz are accepted; 50 MiB per archive is the default. The separately marked incomplete-diagnostics workflow requires an explanation of at least 20 characters, holds reports privately for administrator approval, and accepts any available archive.

Turnstile is verified server-side. Uploads show progress, and the browser keeps the submission token in sessionStorage during pending or interrupted requests. Accepted reports return HTTP 202; the client then polls for the GitHub number and URL. Email failures do not affect issue creation.

Private archives are available only after a FleetControl administrator signs in at `https://openhd.tech/#/admin/bugs`. The website sends no cross-origin session cookies and receives no permanent download links. Logs are never sent to GitHub or attached to email.

## Deployment

FleetControl's `docs/bug-tracker.md` contains the API contract, configuration and recovery instructions. Configure the API first, then validate this branch with Node 24 and pnpm 9:

```
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm exec playwright install chromium
pnpm test:bugs
```

Playwright uses a built website and mocked integration responses; it does not prove live GitHub creation, human verification or email delivery. Production activation requires the live smoke test in the backend documentation.

Website pushes to `main` publish under `/staging/`; pushes to `online` publish the public root. Feature-branch and PR validation do not deploy. Set the Turnstile widget hostname to `openhdfpv.org` and allow that exact HTTPS origin on FleetControl. The submit button stays disabled until the API reports that all required backend integrations are configured.
