// Renders 1200x630 share cards with headless Chrome into the repo's images/og/.
// Usage (repo root): node scripts/make-og.js . — re-run after adding a post, then point its og:image at images/og/blog-<slug>.png
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const repo=path.resolve(process.argv[2]); // absolute: Chrome writes a relative --screenshot path somewhere else, silently (2026-10-18)
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const out=path.join(repo,'images','og'); fs.mkdirSync(out,{recursive:true});
const work=path.join(require('os').tmpdir(),'bella-og'); fs.mkdirSync(work,{recursive:true});
const submark='file:///'+path.join(repo,'bella-submark.svg').replace(/\\/g,'/');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const posts=fs.readdirSync(path.join(repo,'blog')).filter(f=>f.endsWith('.html')&&fs.readFileSync(path.join(repo,'blog',f),'utf8').includes('"@type": "BlogPosting"')).map(f=>{
  const h=fs.readFileSync(path.join(repo,'blog',f),'utf8');
  return {slug:f.replace('.html',''),kicker:(h.match(/"articleSection": "([^"]+)"/)||[])[1],title:(h.match(/"headline": "([^"]+)"/)||[])[1].replace(/\\"/g,'"'),foot:'The treatment coordinator blog'};
});
const cards=[
 {slug:'pricing',kicker:'Pricing',title:'From $99 per office / month. Three plans, from single practices to DSOs.',foot:'Bella pricing'},
 {slug:'bella-coach',kicker:'Bella Coach',title:'Rehearse the consult against a patient who pushes back.',foot:'AI role-play for dental treatment coordinators'},
 {slug:'treatment-desk',kicker:'Bella Treatment Desk',title:'Build the estimate at the chair, not after the family leaves.',foot:'Chairside estimates and case-acceptance tracking'},
 {slug:'bella-voice',kicker:'Bella Voice',title:'Coach the consult that actually happened.',foot:'Consult recording and coaching, BAA-backed'},
 {slug:'blog',kicker:'The treatment coordinator blog',title:'The conversation, examined.',foot:'Case acceptance, treatment presentation, objections'},
 {slug:'about',kicker:'About Bella',title:'AI coaching software for dental treatment coordinators.',foot:'Bella Coach LLC'},
 ...posts.map(p=>({...p,slug:'blog-'+p.slug}))
];
for(const c of cards){
  const size=c.title.length>70?56:c.title.length>45?64:72;
  const html=`<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@500;600&display=block" rel="stylesheet">
<style>
html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background:#fafaf9;font-family:Inter,sans-serif;position:relative}
.wash{position:absolute;inset:0;background:radial-gradient(900px 500px at 105% -10%,#fef6e7 0,#fef6e7 35%,transparent 70%),radial-gradient(700px 420px at -10% 120%,#f5ead7 0,transparent 65%)}
.bar{position:absolute;left:0;top:0;bottom:0;width:14px;background:linear-gradient(180deg,#b45309,#78350f)}
.in{position:absolute;left:96px;right:96px;top:84px;bottom:72px;display:flex;flex-direction:column}
.k{font-size:22px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#92400e}
h1{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:${size}px;line-height:1.12;color:#1c1917;margin:28px 0 0;letter-spacing:-.01em}
.f{margin-top:auto;display:flex;align-items:center;gap:18px;color:#57534e;font-size:24px}
.f img{height:58px}
.f b{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:34px;color:#1c1917}
.f span{border-left:1px solid #e7ce92;padding-left:18px}
.u{margin-left:auto;font-weight:600;color:#92400e}
</style></head><body><div class="wash"></div><div class="bar"></div>
<div class="in"><div class="k">${esc(c.kicker)}</div><h1>${esc(c.title)}</h1>
<div class="f"><img src="${submark}" alt=""><b>Bella</b><span>${esc(c.foot)}</span><span class="u">bellacoach.com</span></div></div></body></html>`;
  const hf=path.join(work,c.slug+'.html'); fs.writeFileSync(hf,html);
  const png=path.join(out,c.slug+'.png');
  execFileSync(chrome,['--headless=new','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1','--window-size=1200,630','--virtual-time-budget=4000','--screenshot='+png,'file:///'+hf.replace(/\\/g,'/')],{stdio:'ignore'});
  console.log(c.slug,fs.statSync(png).size);
}
