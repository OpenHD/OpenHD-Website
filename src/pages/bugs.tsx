import React, {useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {BugEntry, bugFetch, entryType, labelValue, useBugApi} from '../components/BugApi';
import styles from './bugs.module.css';

export default function Bugs() {
  const endpoint = useBugApi();
  const [items, setItems] = useState<BugEntry[]>([]), [total, setTotal] = useState(0), [partial, setPartial] = useState(false);
  const [error, setError] = useState(''), [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(''), [search, setSearch] = useState(''), [showGitHub, setShowGitHub] = useState(false), [repo, setRepo] = useState(''), [repository, setRepository] = useState(''), [component, setComponent] = useState(''), [components, setComponents] = useState<string[]>([]), [page, setPage] = useState(1);
  useEffect(() => { if (query === search && repo === repository) return; const timer = setTimeout(() => { setSearch(query); setRepository(repo); setPage(1); }, 450); return () => clearTimeout(timer); }, [query, repo, search, repository]);
  useEffect(() => { if (endpoint) bugFetch(`${endpoint}/config`).then(result => setComponents(result.components)).catch(() => {}); }, [endpoint]);
  useEffect(() => {
    if (!endpoint) return;
    const abort = new AbortController(); setLoading(true); setError(''); setItems([]);
    const params = new URLSearchParams({q: search, type: showGitHub ? 'all' : 'bug', status: 'open', repository, component, page: String(page)});
    bugFetch(`${endpoint}?${params}`, {signal: abort.signal}).then(result => { setItems(result.items || []); setTotal(result.total_count); setPartial(Boolean(result.incomplete_results)); }).catch(e => { if (!abort.signal.aborted) { setError(e.message); setItems([]); } }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [endpoint, search, showGitHub, repository, component, page]);
  const visibleItems = items.filter(item => item.state === 'open' && !item.merged && !item.pull_request?.merged_at && (showGitHub || entryType(item) === 'Bug'));
  const pages = Math.min(34, Math.ceil(Math.min(total, 1000) / 30));
  return <Layout title="Bug Tracker"><main className={styles.page}>
    <header className={styles.header}><div><h1>OpenHD Bug Tracker</h1><p>Open bug reports, with optional GitHub issues and pull requests.</p></div><Link className="button button--primary" to="/bugs/report">Report a bug</Link></header>
    <div className={styles.controls}>
      <input aria-label="Search issues" placeholder="Search title or description…" value={query} maxLength={160} onChange={e => setQuery(e.target.value)}/>
      <label>Show GitHub issues and pull requests <select aria-label="Show GitHub issues and pull requests" value={showGitHub ? 'yes' : 'no'} onChange={e => {setShowGitHub(e.target.value === 'yes'); setPage(1);}}><option value="no">No</option><option value="yes">Yes</option></select></label>
      <input aria-label="Repository" placeholder="Repository, e.g. OpenHD/QOpenHD" value={repo} onChange={e => setRepo(e.target.value)}/>
      <select aria-label="Component" value={component} onChange={e => {setComponent(e.target.value); setPage(1);}}><option value="">All components</option>{components.map(c => <option key={c}>{c}</option>)}</select>
    </div>
    {!endpoint && <p role="status">The tracker API is being configured.</p>}
    {loading && <p role="status">Loading GitHub activity…</p>}{error && <p className={styles.error} role="alert">{error}</p>}
    {!loading && !error && endpoint && !visibleItems.length && <p>No open entries match these filters.</p>}
    {!error && <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Number / Title</th><th>Type</th><th>Repository / Component</th><th>Status</th><th>Priority</th><th>Updated</th></tr></thead><tbody>{visibleItems.map(item => <tr key={item.id}>
      <td><Link to={`/bugs/detail?repo=${encodeURIComponent(item.repository_url.split('/repos/')[1])}&number=${item.number}`}>#{item.number} {item.title}</Link></td><td>{entryType(item)}</td><td>{item.repository_url.split('/repos/')[1]}<small className={styles.meta}>{labelValue(item, 'component')}</small></td><td><span className={styles.badge}>{item.pull_request?.merged_at ? 'merged' : item.state}</span></td><td>{labelValue(item, 'priority')}</td><td>{new Date(item.updated_at).toLocaleDateString()}</td>
    </tr>)}</tbody></table></div>}
    {pages > 0 && <nav className={styles.pagination} aria-label="Tracker pages"><button disabled={loading || page === 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {pages}</span><button disabled={loading || page >= pages} onClick={() => setPage(page + 1)}>Next</button></nav>}
    <p className={styles.note}>Live GitHub data, cached for one minute. Unlabelled priorities and components appear as “—”.{total > 1000 && ' GitHub search shows the first 1,000 results; narrow your filters for older activity.'}{partial && ' GitHub returned partial results; try a narrower search.'}</p>
  </main></Layout>;
}
