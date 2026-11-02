import React, {useEffect, useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import styles from './bugs.module.css';

type Entry = {id:number; number:number; title:string; state:string; html_url:string; updated_at:string; repository_url:string; pull_request?:object; labels:{name:string}[]};
export default function Bugs() {
 const [items,setItems]=useState<Entry[]>([]);
 const [error,setError]=useState('');
 const [query,setQuery]=useState('');
 const [type,setType]=useState('all');
 useEffect(()=>{ const abort=new AbortController(); fetch('https://api.github.com/search/issues?q=org%3AOpenHD%20sort%3Aupdated-desc&per_page=100',{signal:abort.signal,headers:{Accept:'application/vnd.github+json'}}).then(r=>{if(!r.ok)throw Error('GitHub API unavailable');return r.json()}).then(j=>setItems(j.items||[])).catch(e=>{if(!abort.signal.aborted)setError(String(e))});return ()=>abort.abort();},[]);
 const filtered=useMemo(()=>items.filter(i=>(type==='all'||(type==='pulls'?!!i.pull_request:!i.pull_request))&&(i.title+' '+i.repository_url+' '+i.number).toLowerCase().includes(query.toLowerCase())),[items,query,type]);
 return <Layout title="Bug Tracker"><main className={styles.page}><header className={styles.header}><div><h1>OpenHD Bug Tracker</h1><p>GitHub issues and pull requests across the OpenHD organization.</p></div><a className="button button--primary" href="/bugs/report">Report a bug</a></header><div className={styles.controls}><select aria-label="Filter type" value={type} onChange={e=>setType(e.target.value)}><option value="all">All activity</option><option value="issues">Issues</option><option value="pulls">Pull requests</option></select><input aria-label="Search" placeholder="Search issues..." value={query} onChange={e=>setQuery(e.target.value)}/></div><div className={styles.list}>{error?<p role="alert">{error}</p>:filtered.length===0?<p>No items loaded or matching.</p>:filtered.map(i=><a key={i.id} className={styles.item} href={i.html_url} target="_blank" rel="noopener noreferrer"><span className={styles.title}>#{i.number} {i.title}</span><span>{i.pull_request?'Pull request':'Issue'}</span><span>{i.state}</span><span>{i.repository_url.split('/').pop()}</span></a>)}</div><p className={styles.note}>Latest 100 updated public GitHub items. Open an entry on GitHub for full details.</p></main></Layout>;
}
