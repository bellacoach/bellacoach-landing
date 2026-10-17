// Builds the blog topic hubs (/blog/objections, /blog/treatment-presentation,
// /blog/treatment-coordinator-role) from blog.html's own shell and post cards,
// so a new post appears on its hub after re-running: node scripts/build-hubs.js
const fs = require('fs');

const HUBS = [
  {
    slug: 'objections', tags: ['Objections'],
    title: 'Dental Objection Handling for Treatment Coordinators | Bella',
    h1: 'Objection handling, one sentence at a time',
    eyebrow: 'Topic · Objections',
    desc: 'How treatment coordinators handle the objections that lose dental cases: “I need to think about it,” the spouse, the silence after the price, and phasing.',
    intro: 'Most dental cases are not lost to a hard no. They are lost to a polite sentence that sounds like a delay — “I need to think about it,” “let me check with my husband,” “can we just do the one tooth?” — and to what the coordinator says, or fails to say, in the seconds after it. These posts take one objection each and show what it usually means, how to find out, and the words that keep the case alive without pressuring anyone.',
  },
  {
    slug: 'treatment-presentation', tags: ['Presentation', 'Insurance'],
    title: 'Dental Treatment Presentation: Value, Price and Insurance | Bella',
    h1: 'Treatment presentation, from the photo to the number',
    eyebrow: 'Topic · Presentation',
    desc: 'How to present a dental treatment plan: build value before price, show the tooth on the screen, explain insurance in plain language, and handle the child with no pain.',
    intro: 'A treatment presentation is a short sequence: show the problem, explain what happens if it waits, say what the treatment does and what insurance pays, then say the number. Most of what goes wrong happens when the order breaks — the price arrives first, the printout does the talking, or the insurance explanation turns into jargon. Start with value before price; the other posts go deeper on each step.',
  },
  {
    slug: 'treatment-coordinator-role', tags: ['The role'],
    title: 'The Treatment Coordinator Role: Hiring, Bonuses, Handoffs | Bella',
    h1: 'The treatment coordinator role, for owners and managers',
    eyebrow: 'Topic · The role',
    desc: 'For practice owners and office managers: how to hire a treatment coordinator, structure bonuses that do not backfire, and split the conversation with the dentist.',
    intro: 'These posts are written for the people who build the role rather than fill it: practice owners, office managers and regional leads. They cover who to hire and how to test for it, how to pay coordinators without distorting what gets presented, and where the coordinator’s conversation should end and the dentist’s begin.',
  },
];

const shell = fs.readFileSync('blog.html', 'utf8');
const cards = [...shell.matchAll(/<a class="post-card" href="\/blog\/([^"]+)">[\s\S]*?<span class="tag">([^<]+)<\/span>[\s\S]*?<h2>([\s\S]*?)<\/h2>[\s\S]*?<\/a>/g)]
  .map(m => ({ slug: m[1], tag: m[2], title: m[3], html: m[0] }));

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const text = s => s.replace(/<[^>]+>/g, '').replace(/"/g, '\\"');

for (const hub of HUBS) {
  const url = 'https://bellacoach.com/blog/' + hub.slug;
  const mine = cards.filter(c => hub.tags.includes(c.tag));
  let h = shell;
  const rep = (re, to) => { if (!re.test(h)) throw new Error(hub.slug + ': ' + re); h = h.replace(re, to); };
  rep(/<title>[^<]*<\/title>/, '<title>' + esc(hub.title) + '</title>');
  rep(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + esc(hub.desc) + '">');
  rep(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + url + '">');
  rep(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + esc(hub.title) + '">');
  rep(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + esc(hub.desc) + '">');
  rep(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + url + '">');
  // schema: a CollectionPage + breadcrumb instead of the Blog/ItemList of every post
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '');
  const ld = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'CollectionPage', '@id': url, url, name: hub.h1, description: hub.desc,
        isPartOf: { '@id': 'https://bellacoach.com/blog' },
        mainEntity: { '@type': 'ItemList', itemListElement: mine.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: 'https://bellacoach.com/blog/' + c.slug, name: text(c.title) })) } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bellacoach.com/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://bellacoach.com/blog' },
        { '@type': 'ListItem', position: 3, name: hub.h1, item: url } ] },
    ],
  };
  h = h.replace('<script src="/tracking.js"></script>', '<script type="application/ld+json">\n' + JSON.stringify(ld, null, 2) + '\n</script>\n<script src="/tracking.js"></script>');
  // header and post list
  rep(/<header class="blog-head">[\s\S]*?<\/header>/,
    '<header class="blog-head">\n  <div class="wrap">\n    <span class="eyebrow">' + hub.eyebrow + '</span>\n    <h1>' + hub.h1 + '</h1>\n    <p>' + hub.intro + '</p>\n    <p class="byline-index"><a href="/blog">&#8592; All posts</a> &nbsp;·&nbsp; Written by <a href="/about#nick">Nick Fairbanks</a>.</p>\n  </div>\n</header>');
  rep(/<main class="posts">[\s\S]*?<\/main>/, '<main class="posts">\n  ' + mine.map(c => c.html).join('\n\n  ') + '\n</main>');
  h = h.replace(/<p class="empty">[\s\S]*?<\/p>\n?/, '');
  fs.writeFileSync('blog/' + hub.slug + '.html', h);
  console.log('blog/' + hub.slug + '.html', mine.length, 'posts');
}
