import React, {useEffect, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {bugFetch, useBugApi} from '../../components/BugApi';
import styles from '../bugs.module.css';

type Config = {enabled: boolean; maxArchiveBytes: number; components: string[]; turnstileSiteKey: string};
type Submission = {id: string; number?: number; url?: string; status: string; message: string};
declare global {interface Window {turnstile?: {render(element: HTMLElement, options: Record<string, unknown>): string; remove(id: string): void; reset(id: string): void}}}
const fields = [['title', 'Bug title', 160], ['description', 'Description', 10000], ['steps', 'Steps to reproduce', 10000], ['version', 'OpenHD version', 200], ['airHardware', 'Air hardware', 200], ['groundHardware', 'Ground hardware', 200]] as const;
export default function ReportBug() {
  const endpoint = useBugApi(), widget = useRef<HTMLDivElement>(null), widgetId = useRef('');
  const [config, setConfig] = useState<Config|null>(null), [token, setToken] = useState(''), [human, setHuman] = useState('');
  const [values, setValues] = useState<Record<string, string>>({}), [air, setAir] = useState<File|null>(null), [ground, setGround] = useState<File|null>(null);
  const [incomplete, setIncomplete] = useState(false), [busy, setBusy] = useState(false), [progress, setProgress] = useState(0), [error, setError] = useState(''), [submission, setSubmission] = useState<Submission|null>(null), [uncertain, setUncertain] = useState(false);
  useEffect(() => {
    if (!endpoint) return;
    Promise.all([bugFetch(`${endpoint}/config`), bugFetch(`${endpoint}/challenge`)]).then(([c, challenge]) => {
      setConfig(c); const saved = sessionStorage.getItem('openhd-bug-submission'); setToken(saved || challenge.token);
      if (saved) {setUncertain(true); bugFetch(`${endpoint}/submission`, {headers: {'X-Bug-Token': saved}}).then(setSubmission).catch(() => setError('A previous submission may be pending. Check its status before submitting again.'));}
    }).catch(e => setError(e.message));
  }, [endpoint]);
  useEffect(() => {
    if (!config?.enabled || !widget.current) return;
    let disposed = false;
    const render = () => {if (!disposed && window.turnstile && widget.current) widgetId.current = window.turnstile.render(widget.current, {sitekey: config.turnstileSiteKey, action: 'bug-report', callback: setHuman, 'expired-callback': () => setHuman(''), 'error-callback': () => {setHuman(''); setError('Human verification could not load. Please retry.');}});};
    const existing = document.querySelector<HTMLScriptElement>('script[data-openhd-turnstile]');
    const script = existing || document.createElement('script');
    if (window.turnstile) render(); else {script.addEventListener('load', render); if (!existing) {script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.dataset.openhdTurnstile = 'true'; document.head.appendChild(script);}}
    return () => {disposed = true; script.removeEventListener('load', render); if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);};
  }, [config]);
  useEffect(() => {
    if (!submission || submission.status !== 'processing') return;
    const timer = setInterval(() => {bugFetch(`${endpoint}/submission`, {headers: {'X-Bug-Token': token}}).then(setSubmission).catch(e => setError(e.message));}, 5000);
    return () => clearInterval(timer);
  }, [submission?.status, endpoint, token]);
  const valid = (file: File|null) => Boolean(file && file.size > 0 && file.size <= (config?.maxArchiveBytes || 52428800) && /\.(zip|tgz|tar\.gz)$/i.test(file.name));
  const archivesReady = incomplete ? (!air || valid(air)) && (!ground || valid(ground)) && !(air && ground) && (values.diagnosticReason || '').trim().length >= 20 : valid(air) && valid(ground);
  const ready = Boolean(endpoint && config?.enabled && token && human && fields.every(([key]) => values[key]?.trim()) && values.component && archivesReady && !busy && !submission && !uncertain);
  async function checkStatus() {setError(''); try {setSubmission(await bugFetch(`${endpoint}/submission`, {headers: {'X-Bug-Token': token}}));} catch(e) {if (e.status === 404) {setUncertain(false); setError('No saved report was found. You can retry this form using the same submission token.');} else setError(e.message);}}
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!ready) return;
    const body = new FormData(); for (const [key, value] of Object.entries(values)) body.set(key, value);
    body.set('workflow', incomplete ? 'incomplete' : 'normal'); body.set('cf-turnstile-response', human);
    if (air) body.set('air_logs', air); if (ground) body.set('ground_logs', ground);
    setBusy(true); setError(''); setProgress(0); sessionStorage.setItem('openhd-bug-submission', token);
    try {
      const result = await new Promise<Submission>((resolve, reject) => {
        const request = new XMLHttpRequest(); request.open('POST', endpoint); request.setRequestHeader('X-Bug-Token', token); request.timeout = 300000;
        request.upload.onprogress = e => {if (e.lengthComputable) setProgress(Math.round(100 * e.loaded / e.total));};
        request.onload = () => {try {const response = JSON.parse(request.responseText); if (request.status >= 200 && request.status < 300) resolve(response); else {sessionStorage.removeItem('openhd-bug-submission'); reject(Error(response.message || 'Submission failed.'));}} catch {setUncertain(true); reject(Error('Server response was interrupted. Check submission status before retrying.'));}};
        request.onerror = request.ontimeout = () => {setUncertain(true); reject(Error('Connection interrupted. Check submission status before retrying.'));};
        request.send(body);
      });
      setSubmission(result);
    } catch(e) {setError(e.message); setHuman(''); if (widgetId.current) window.turnstile?.reset(widgetId.current);}
    finally {setBusy(false);}
  }
  async function newReport() {sessionStorage.removeItem('openhd-bug-submission'); setSubmission(null); setUncertain(false); setError(''); setToken((await bugFetch(`${endpoint}/challenge`)).token); setHuman(''); if (widgetId.current) window.turnstile?.reset(widgetId.current);}
  return <Layout title="Report a bug"><main className={styles.page}><header className={styles.header}><div><h1>Report a bug</h1><p>Help us reproduce the problem. Air and Ground diagnostics are required for normal reports.</p></div><Link to="/bugs">Back to tracker</Link></header>
    {!endpoint || config && !config.enabled ? <p className={styles.notice}>Submissions are awaiting server configuration. Please try again later.</p> : !config ? <p role="status">Loading report form…</p> : null}
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {submission ? <section className={styles.notice} role="status"><h2>{submission.status === 'created' ? `Bug #${submission.number} created` : 'Report received'}</h2><p>{submission.message}</p>{submission.url && /^https:\/\/github\.com\/OpenHD\//.test(submission.url) && <p><a href={submission.url}>View your issue on GitHub</a></p>}<p>Your archives remain private. They are never attached to GitHub issues or notification emails.</p>{submission.status !== 'processing' && <button onClick={() => void newReport()}>Start another report</button>}</section> : <form className={styles.form} onSubmit={submit}>
      <fieldset disabled={busy || uncertain}><legend>Bug details</legend>
        {fields.map(([key, label, max]) => <label key={key}>{label} *{key === 'description' || key === 'steps' ? <textarea required rows={5} maxLength={max} value={values[key] || ''} onChange={e => setValues({...values, [key]: e.target.value})}/> : <input required maxLength={max} value={values[key] || ''} onChange={e => setValues({...values, [key]: e.target.value})}/>}</label>)}
        <label>Affected component *<select required value={values.component || ''} onChange={e => setValues({...values, component: e.target.value})}><option value="">Select a component</option>{config?.components.map(c => <option key={c}>{c}</option>)}</select></label>
        <h2>Diagnostic archives</h2><p className={styles.help}>.zip, .tar.gz or .tgz, up to {Math.floor((config?.maxArchiveBytes || 52428800) / 1048576)} MiB per archive. Review diagnostics for private information before uploading. Archives are retained privately for the server’s configured retention period (normally 90 days).</p>
        <label className={styles.check}><input type="checkbox" checked={incomplete} onChange={e => setIncomplete(e.target.checked)}/>Exceptional case: a unit cannot boot, so diagnostics are unavailable</label>
        {incomplete && <div className={styles.notice}><b>Incomplete diagnostics — maintainer review required</b><p>Upload any available archive. This report stays in a private review queue until a maintainer approves it.</p><label>Which unit cannot boot, and why can you not obtain its logs? *<textarea required minLength={20} maxLength={2000} value={values.diagnosticReason || ''} onChange={e => setValues({...values, diagnosticReason: e.target.value})}/></label></div>}
        <div className={styles.columns}>{(['air', 'ground'] as const).map(role => {const file = role === 'air' ? air : ground; return <label key={role}>{role === 'air' ? 'Air Unit' : 'Ground Unit'} diagnostic archive {!incomplete && '*'}<input type="file" required={!incomplete} accept=".zip,.tar.gz,.tgz" onChange={e => (role === 'air' ? setAir : setGround)(e.target.files?.[0] || null)}/>{file && !valid(file) && <span className={styles.error}>Choose a nonempty supported archive within the size limit.</span>}</label>;})}</div>
        <label className={styles.trap} aria-hidden="true">Leave empty<input tabIndex={-1} autoComplete="off" value={values.website || ''} onChange={e => setValues({...values, website: e.target.value})}/></label>
      </fieldset>
      <div ref={widget}/>
      {busy && <div role="status"><label>Uploading archives: {progress}%<progress max={100} value={progress}/></label>{progress === 100 && <p>Validating diagnostics and saving your report…</p>}</div>}
      <button className="button button--primary" type="submit" disabled={!ready}>{busy ? 'Submitting…' : incomplete ? 'Submit for maintainer review' : 'Submit bug report'}</button>
    </form>}
    {uncertain && !submission && <div className={styles.notice}><p>A submission may already exist. Keep this page open and check its status before starting another report.</p><button onClick={() => void checkStatus()}>Check submission status</button></div>}
  </main></Layout>;
}
