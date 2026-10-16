/* Site-wide measurement: GA4 + Meta Pixel, loaded once in every page's <head>.

   One include so a new page can't ship without tracking (the product pages
   once did — no Pixel). Pages never call gtag/fbq for the common events:
   they're wired here from markup that already exists —
     [data-demo]            opens the booking modal → demo_modal_open
     [data-plan] on it      which tier the visitor picked → select_plan
     form#demoForm          the page dispatches "bella:lead" on success → generate_lead / Lead
     a[href^="mailto:"]     → contact_email_click / Contact
     the app link           → sign_in_click
     #whyVideo, #meetAudio  → video_start, audio_play (once each)
   and /#book-demo on any page opens the modal, so off-page CTAs (the blog)
   land on the form rather than at the bottom of the homepage. */
(function () {
  var GA_ID = 'G-7FVZ87TK7H';
  var PIXEL_ID = '1379062707534315';

  // Monthly list price per user, sent as the lead's value so reports show
  // pipeline rather than a bare count. White-Glove is a range; use the floor.
  var PLAN_VALUE = { 'self-serve': 250, 'customization': 500, 'white-glove': 750 };

  var path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  var group = path === '/' ? 'home'
    : /^\/blog\//.test(path) ? 'blog_post'
    : path === '/blog' ? 'blog_index'
    : /^\/(bella-coach|treatment-desk|bella-voice)$/.test(path) ? 'product'
    : path === '/pricing' ? 'pricing'
    : /^\/(privacy|terms)$/.test(path) ? 'legal' : 'other';
  var slug = path === '/' ? 'home' : path.split('/').pop();

  /* GA4 */
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { content_group: group });
  var g = document.createElement('script');
  g.async = true;
  g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(g);

  /* Meta Pixel (standard base code) */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');
  if (group === 'product' || group === 'pricing') {
    fbq('track', 'ViewContent', { content_name: slug, content_category: group });
  }

  function track(name, params, metaStd, metaCustom) {
    gtag('event', name, params || {});
    if (metaStd) fbq('track', metaStd, metaCustom || {});
  }
  window.bellaTrack = track;

  function where(el) {
    var cta = el.getAttribute('data-cta');
    if (cta) return cta;
    var s = el.closest('nav, header, footer, section, aside, .cta-band');
    return (s && (s.id || s.className.split(' ')[0])) || 'unknown';
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a, button');
    if (!a) return;

    if (a.hasAttribute('data-demo')) {
      var plan = a.getAttribute('data-plan') || '';
      var form = document.getElementById('demoForm');
      if (form) {
        if (form.plan) form.plan.value = plan;
        if (form.source_page) form.source_page.value = slug;
      }
      track('demo_modal_open', { cta_location: where(a), plan: plan, page: slug });
      if (plan) track('select_plan', { plan: plan }, 'InitiateCheckout', { content_name: plan });
      return;
    }

    var href = a.getAttribute('href') || '';
    if (/^mailto:/.test(href)) {
      track('contact_email_click', { link_location: where(a), page: slug }, 'Contact');
    } else if (/^https:\/\/app\.bellacoach\.com/.test(href)) {
      track('sign_in_click', { page: slug });
    } else if (a.closest('.cta-band') || a.hasAttribute('data-cta')) {
      track('cta_click', { cta: (a.textContent || '').trim().slice(0, 60), href: href, page: slug });
    }
  }, true);

  document.addEventListener('bella:lead', function (e) {
    var form = (e.detail && e.detail.form) || document.getElementById('demoForm');
    var plan = (form && form.plan && form.plan.value) || '';
    var value = PLAN_VALUE[plan] || 0;
    track('generate_lead', {
      lead_type: 'demo_request', plan: plan, source_page: slug,
      currency: 'USD', value: value
    }, 'Lead', { currency: 'USD', value: value, content_name: plan || 'demo' });
  });

  document.addEventListener('DOMContentLoaded', function () {
    var v = document.getElementById('whyVideo');
    if (v) v.addEventListener('play', function () { track('video_start', { video_title: 'why-bella' }); }, { once: true });
    var au = document.getElementById('meetAudio');
    if (au) au.addEventListener('play', function () { track('audio_play', { audio_title: 'bella-intro' }); }, { once: true });

    // Reaching the closing CTA counts as reading the post through.
    var end = group === 'blog_post' && document.querySelector('.cta-band');
    if (end && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { track('article_complete', { article: slug }); io.disconnect(); }
      });
      io.observe(end);
    }

    if (location.hash === '#book-demo') {
      var opener = document.querySelector('[data-demo]');
      if (opener) opener.click();
    }
  });
})();
