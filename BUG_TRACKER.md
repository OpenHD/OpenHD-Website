## Bug tracker

`/bugs` lists recent public issues and pull requests from the OpenHD GitHub organization. `/bugs/report` provides a form requiring both Air and Ground archives.

The site is hosted on GitHub Pages, which cannot receive uploads directly. The form remains disabled until `BUG_REPORT_API_URL` is supplied as a build-time environment variable for Docusaurus.

Expected API: `POST` multipart/form-data with `title`, `description`, `air_logs`, and `ground_logs`. On success return JSON containing the new GitHub issue `url`.

Before production, deploy an authenticated backend that validates the two archives server-side, enforces 50 MiB per archive and abuse limits, stores files privately, creates a GitHub issue with sanitized metadata, and sends the configured maintainer an email notification. Diagnostic archives must never be published to GitHub or emailed as attachments. Provide authorized maintainer downloads with audit logging, retention policies and expiring links. Use backend secrets for GitHub and mail access. Ensure safe archive inspection and file-size validation.

No secure upload service or notification delivery is deployed by this frontend change.
