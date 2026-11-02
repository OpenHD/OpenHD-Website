import React, {useState} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import styles from '../bugs.module.css';

export default function ReportBug() {
 const {siteConfig}=useDocusaurusContext();
 const endpoint=String(siteConfig.customFields?.bugReportApiUrl||'');
 const [title,setTitle]=useState('');
 const [description,setDescription]=useState('');
 const [air,setAir]=useState<File|null>(null);
 const [ground,setGround]=useState<File|null>(null);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const valid=(f:File|null)=>Boolean(f&&f.size>0&&f.size<=52428800&&(/\.zip$|\.tgz$|\.tar\.gz$/i).test(f.name));
 const ready=Boolean(endpoint&&title.trim()&&description.trim()&&valid(air)&&valid(ground)&&!busy);
 async function submit(e:React.FormEvent<HTMLFormElement>) {
  e.preventDefault();if(!ready)return;
  const body=new FormData();body.set('title',title);body.set('description',description);body.set('air_logs',air!);body.set('ground_logs',ground!);
  setBusy(true);setMessage('');
  try{
   const response=await fetch(endpoint,{method:'POST',body});
   if(!response.ok)throw new Error('Report submission failed.');
   const result=await response.json();
   setMessage(typeof result.url==='string'&&result.url.startsWith('https://github.com/OpenHD/')?'Report created: '+result.url:'Report submitted.');
  }catch(e){setMessage(e instanceof Error?e.message:'Unable to submit report.');}
  finally{setBusy(false);}
 }
 return <Layout title="Report a bug"><main className={styles.page}><header className={styles.header}><div><h1>Report a bug</h1><p>Air and Ground diagnostic logs are required.</p></div><Link to="/bugs">Back to tracker</Link></header>
 <form className={styles.form} onSubmit={submit}>
 <label>Title *<input required value={title} maxLength={160} onChange={e=>setTitle(e.target.value)}/></label>
 <label>Description and reproduction steps *<textarea required rows={6} value={description} maxLength={10000} onChange={e=>setDescription(e.target.value)}/></label>
 <h2>Required diagnostic archives</h2><p className={styles.help}>Upload .zip, .tar.gz or .tgz archives up to 50 MB each. Check logs for private information before uploading.</p>
 <div className={styles.columns}>
 <label>Air unit logs *<input required type="file" accept=".zip,.gz,.tgz" onChange={e=>setAir(e.target.files?.[0]||null)}/>{air&&!valid(air)&&<span className={styles.error}>Invalid archive</span>}</label>
 <label>Ground unit logs *<input required type="file" accept=".zip,.gz,.tgz" onChange={e=>setGround(e.target.files?.[0]||null)}/>{ground&&!valid(ground)&&<span className={styles.error}>Invalid archive</span>}</label>
 </div>
 {!endpoint&&<p className={styles.notice}>Submission is disabled until the secure upload API is configured.</p>}
 {message&&<p role="status" className={styles.notice}>{message}</p>}
 <button className="button button--primary" type="submit" disabled={!ready}>{busy?'Uploading…':'Submit bug report'}</button>
 </form></main></Layout>;
}
