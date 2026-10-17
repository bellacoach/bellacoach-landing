// 06-X1: static RSS feed at /blog/feed.xml built from the posts' own metadata, plus
// <link rel="alternate"> on the blog index and every post. Re-run after adding a post.
const fs=require('fs');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const posts=fs.readdirSync('blog').filter(f=>f.endsWith('.html')).map(f=>{
  const h=fs.readFileSync('blog/'+f,'utf8');
  return {slug:f.replace('.html',''),
    title:(h.match(/"headline": "([^"]+)"/)||[])[1],
    desc:(h.match(/<meta property="og:description" content="([^"]*)">/)||[])[1]||'',
    date:(h.match(/"datePublished": "([^"]+)"/)||[])[1],
    cat:(h.match(/"articleSection": "([^"]+)"/)||[])[1]||''};
}).sort((a,b)=>b.date.localeCompare(a.date));
const rfc=d=>new Date(d+'T12:00:00Z').toUTCString();
const xml=`<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated from the post files. Run "node scripts/build-feed.js" from the repo root after publishing a post. -->
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bella — the treatment coordinator blog</title>
    <link>https://bellacoach.com/blog</link>
    <atom:link href="https://bellacoach.com/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Practical writing on case acceptance, treatment presentation, and the treatment coordinator role.</description>
    <language>en-us</language>
    <lastBuildDate>${rfc(posts[0].date)}</lastBuildDate>
${posts.map(p=>`    <item>
      <title>${esc(p.title)}</title>
      <link>https://bellacoach.com/blog/${p.slug}</link>
      <guid isPermaLink="true">https://bellacoach.com/blog/${p.slug}</guid>
      <pubDate>${rfc(p.date)}</pubDate>
      <category>${esc(p.cat)}</category>
      <description>${esc(p.desc)}</description>
    </item>`).join('\n')}
  </channel>
</rss>
`;
fs.writeFileSync('blog/feed.xml',xml);
const tag='<link rel="alternate" type="application/rss+xml" title="Bella blog" href="https://bellacoach.com/blog/feed.xml">';
for(const f of ['blog.html',...fs.readdirSync('blog').filter(f=>f.endsWith('.html')).map(f=>'blog/'+f)]){
  let h=fs.readFileSync(f,'utf8');if(!h.includes('blog/feed.xml')){h=h.replace(/(<link rel="canonical"[^>]*>)/,'$1\n'+tag);fs.writeFileSync(f,h);}
}
console.log('feed items',posts.length,posts.map(p=>p.date).join(' '));
