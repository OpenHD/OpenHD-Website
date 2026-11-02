import React, {useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {BugEntry, bugFetch, entryType, labelValue, useBugApi} from '../../components/BugApi';
import styles from '../bugs.module.css';

export default function BugDetail() {
  const endpoint = useBugApi(); const [entry, setEntry] = useState<BugEntry|null>(null), [error, setError] = useState('');
  useEffect(() => {
    if (!endpoint) {setError('The tracker API is being configured.'); return;}
    const params = new URLSearchParams(window.location.search), repo = params.get('repo') || '', number = params.get('number') || '';
    if (!/^OpenHD\/[\w.-]+$/.test(repo) || !/^[1-9]\d*$/.test(number)) {setError('Invalid entry link.'); return;}
    const abort = new AbortController();
    bugFetch(`${endpoint}/entry/${repo}/${number}`, {signal: abort.signal}).then(setEntry).catch(e => {if (!abort.signal.aborted) setError(e.message);});
    return () => abort.abort();
  }, [endpoint]);
  return <Layout title={entry?.title || 'Bug details'}><main className={styles.page}><Link to="/bugs">← Back to tracker</Link>
    {error ? <p role="alert">{error}</p> : !entry ? <p role="status">Loading details…</p> : <>
      <h1>#{entry.number} {entry.title}</h1><p>{entryType(entry)} · <span className={styles.badge}>{entry.merged ? 'merged' : entry.state}</span> · Component: {labelValue(entry, 'component')} · Priority: {labelValue(entry, 'priority')}</p>
      <p>Updated {new Date(entry.updated_at).toLocaleString()} · <a href={entry.html_url} target="_blank" rel="noreferrer">View original on GitHub</a></p>
      <article className={styles.description}>{entry.body || 'No description provided.'}</article>
      {entry.related?.length > 0 && <section><h2>Associated pull requests</h2>{entry.related.map(pr => <p key={pr.id}><a href={pr.html_url} target="_blank" rel="noreferrer">#{pr.number} {pr.title}</a> · {pr.pull_request?.merged_at ? 'merged' : pr.state}</p>)}</section>}
      {entry.labels.some(label => label.name === 'website-report') && <section className={styles.notice}><h2>Diagnostic files</h2><p>Diagnostics are private and may expire under the retention policy. Authorized maintainers can <a href="https://openhd.tech/#/admin/bugs">sign in to FleetControl</a> to review and download Air and Ground logs.</p></section>}
    </>}
  </main></Layout>;
}
