// Writes the site navigation into every page from ONE template, so the copies
// can't drift (there were seven variants on 2026-10-18).
//   node scripts/build-nav.cjs
// Replaces each page's <div class="nav-outer" id="nav"> ... </div> block, and
// makes sure the page loads /nav.css and /nav.js. Re-run after editing MENU.
//
// Products-first, Videa-style (Nick, 2026-10-18): products grouped by the job
// they do, each with an icon and a one-line description. No pricing link: the
// pricing page was removed and /pricing redirects to Book a demo (vercel.json).
const fs = require('fs')
const path = require('path')
const root = path.join(__dirname, '..')

// Lucide-style 24px stroke icons, inline so the menu needs no extra request.
const ICON = {
  coach: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>',
  onboard: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  desk: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"/>',
  voice: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>',
  credentials: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  blog: '<path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  objections: '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
  present: '<path d="M2 3h20M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3M7 21l5-5 5 5"/>',
  role: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  about: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  contact: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
}
const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`
const CHEV = '<svg class="nav-mm__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'

const MENU = [
  {
    id: 'menuProducts', label: 'Products', wide: true,
    groups: [
      { label: 'Practice the conversation', items: [
        { key: 'bella-coach', href: '/bella-coach', icon: 'coach', name: 'Bella Coach', desc: 'Rehearse consults against AI patients who push back, with coaching after every rep.' },
        { key: 'onboard', icon: 'onboard', name: 'Bella Onboard', soon: true, desc: 'Structured training that gets a new hire productive without tying up your best person.' },
      ] },
      { label: 'Present and follow up', items: [
        { key: 'treatment-desk', href: '/treatment-desk', icon: 'desk', name: 'Bella Treatment Desk', desc: 'Chairside estimates from your own fees, then follow-ups to a yes.' },
      ] },
      { label: 'Learn from real consults', items: [
        { key: 'bella-voice', href: '/bella-voice', icon: 'voice', name: 'Bella Voice', desc: 'Turn a recorded consult, with consent, into specific coaching.' },
      ] },
      { label: 'Run the office', items: [
        { key: 'credentials', icon: 'credentials', name: 'Bella Credentials', soon: true, desc: 'Track credentialing and payer enrollment so nothing lapses unnoticed.' },
      ] },
    ],
    feature: { href: '/blog/the-silence-after-you-say-the-number', kicker: 'From the blog', title: 'The silence after you say the number', desc: 'Why the pause after the price is where the case is decided.' },
  },
  {
    id: 'menuLearn', label: 'Learn',
    groups: [{ items: [
      { key: 'blog', href: '/blog', icon: 'blog', name: 'Blog', desc: 'Case acceptance, treatment presentation and objections.' },
      { key: 'objections', href: '/blog/objections', icon: 'objections', name: 'Handling objections', desc: 'What to say, one objection at a time.' },
      { key: 'presentation', href: '/blog/treatment-presentation', icon: 'present', name: 'Presenting treatment', desc: 'From the photo to the number.' },
      { key: 'tc-role', href: '/blog/treatment-coordinator-role', icon: 'role', name: 'The treatment coordinator role', desc: 'Hiring, training and paying a TC, for owners.' },
    ] }],
  },
  {
    id: 'menuCompany', label: 'Company',
    groups: [{ items: [
      { key: 'about', href: '/about', icon: 'about', name: 'About Bella', desc: 'Who builds it, and who writes the blog.' },
      { key: 'contact', href: 'mailto:nick@bellacoach.com?subject=Hello%20from%20bellacoach.com', icon: 'contact', name: 'Contact', desc: 'nick@bellacoach.com' },
    ] }],
  },
]

// Which pages get which Book-a-demo button, and which item is "here".
//   modal: the page has the demo form (#book-demo opens it in place)
//   link:  the form lives on the homepage
//   none:  legal and about pages stay quiet
function pageOptions(rel) {
  const blog = rel.startsWith('blog/') || rel === 'blog.html'
  const current = {
    'bella-coach.html': 'bella-coach', 'treatment-desk.html': 'treatment-desk', 'bella-voice.html': 'bella-voice',
    'blog.html': 'blog', 'blog/objections.html': 'objections', 'blog/treatment-presentation.html': 'presentation',
    'blog/treatment-coordinator-role.html': 'tc-role', 'about.html': 'about',
  }[rel]
  const cta = blog ? 'link' : ['about.html', 'privacy.html', 'terms.html'].includes(rel) ? 'none' : 'modal'
  return { current, cta }
}

function item(it, current) {
  const body = `<span class="nav-mm__ic">${svg(it.icon)}</span><span class="nav-mm__txt"><span class="nav-mm__name">${it.name}${it.soon ? ' <span class="nav-mm__soon">Coming soon</span>' : ''}</span><span class="nav-mm__desc">${it.desc}</span></span>`
  if (it.soon) return `<span class="nav-mm__item nav-mm__item--soon" aria-disabled="true">${body}</span>`
  if (it.key === current) return `<span class="nav-mm__item nav-mm__item--here" aria-current="page">${body}</span>`
  return `<a class="nav-mm__item" href="${it.href}">${body}</a>`
}

function menu(m, current) {
  const groups = m.groups.map((g) =>
    `<div class="nav-mm__group">${g.label ? `<p class="nav-mm__label">${g.label}</p>` : ''}${g.items.map((it) => item(it, current)).join('')}</div>`).join('')
  const f = m.feature
  const feature = f ? `<a class="nav-mm__feature" href="${f.href}"><span class="nav-mm__fkicker">${f.kicker}</span><span class="nav-mm__ftitle">${f.title}</span><span class="nav-mm__fdesc">${f.desc}</span><span class="nav-mm__fmore">Read it &#8594;</span></a>` : ''
  return `<div class="nav-mm" data-menu>
        <button type="button" class="nav-mm__btn" aria-expanded="false" aria-controls="${m.id}">${m.label} ${CHEV}</button>
        <div class="nav-mm__panel${m.wide ? ' nav-mm__panel--wide' : ''}" id="${m.id}">
          <div class="nav-mm__groups">${groups}</div>${feature}
        </div>
      </div>`
}

function nav(opts) {
  const cta = opts.cta === 'modal' ? '\n      <a href="#book-demo" class="cta" data-demo>Book a demo</a>'
    : opts.cta === 'link' ? '\n      <a href="/#book-demo" class="cta" data-cta="nav">Book a demo</a>' : ''
  return `<div class="nav-outer" id="nav">
  <div class="pill">
    <a href="/" class="brand">
      <img src="/bella-submark-96.png" alt="Bella" width="47" height="46"/>
      <span class="b-text"><span class="b-name serif">Bella</span><span class="b-eyebrow">Real-Time Dental Coach</span></span>
    </a>
    <div class="nav-links" id="navLinks">
      ${MENU.map((m) => menu(m, opts.current)).join('\n      ')}
      <a href="https://app.bellacoach.com">Sign in</a>${cta}
    </div>
      <button type="button" class="nav-burger" id="navBurger" aria-label="Menu" aria-expanded="false" aria-controls="navLinks"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
  </div>
</div>`
}

const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html')).concat(
  fs.readdirSync(path.join(root, 'blog')).filter((f) => f.endsWith('.html')).map((f) => 'blog/' + f))
let changed = 0
for (const rel of pages) {
  const file = path.join(root, rel)
  let s = fs.readFileSync(file, 'utf8')
  const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n')
  const start = s.indexOf('<div class="nav-outer" id="nav">')
  if (start < 0) { console.log('skip (no nav):', rel); continue }
  // The block ends at the first line that is exactly "</div>" after the start.
  const end = s.indexOf('\n</div>', start)
  if (end < 0) throw new Error(rel + ': nav block has no end')
  const before = s
  s = s.slice(0, start) + nav(pageOptions(rel)) + s.slice(end + '\n</div>'.length)
  if (!s.includes('href="/nav.css"')) s = s.replace('</head>', '<link rel="stylesheet" href="/nav.css">\n</head>')
  if (!s.includes('src="/nav.js"')) s = s.replace('</body>', '<script src="/nav.js" defer></script>\n</body>')
  if (s !== before) { fs.writeFileSync(file, crlf ? s.replace(/\n/g, '\r\n') : s); changed++ }
}
console.log(`nav written to ${changed} of ${pages.length} pages`)
