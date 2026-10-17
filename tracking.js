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
  var HUBS = ['/blog/objections', '/blog/treatment-presentation', '/blog/treatment-coordinator-role'];
  var group = path === '/' ? 'home'
    : (path === '/blog' || HUBS.indexOf(path) > -1) ? 'blog_index'
    : /^\/blog\//.test(path) ? 'blog_post'
    : /^\/(bella-coach|treatment-desk|bella-voice)$/.test(path) ? 'product'
    : path === '/pricing' ? 'pricing'
    : /^\/(privacy|terms)$/.test(path) ? 'legal' : 'other';
  var slug = path === '/' ? 'home' : path.split('/').pop();

  /* Privacy signals. There is no consent banner, so visitors who have not
     been asked are treated by where they are and what their browser says:
     - Global Privacy Control on  → no ad cookies, no Meta Pixel at all.
     - EEA, UK, Switzerland       → Consent Mode denies everything (GA sends
       cookieless pings only); the Pixel is not loaded. Location comes from
       Google's own region handling for GA, and from the browser time zone
       for the Pixel (a heuristic — a banner would replace it). */
  var gpc = navigator.globalPrivacyControl === true;
  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  var euLike = /^Europe\//.test(tz) || tz === 'Atlantic/Reykjavik' || tz === 'Atlantic/Canary';
  var allowAds = !gpc && !euLike;

  /* GA4 */
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  var DENY = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' };
  gtag('consent', 'default', Object.assign({}, DENY, {
    region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH']
  }));
  gtag('consent', 'default', gpc
    ? { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' }
    : { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
  gtag('js', new Date());
  gtag('config', GA_ID, { content_group: group });
  var g = document.createElement('script');
  g.async = true;
  g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(g);

  /* First touch: where this visit came from, kept for the session so a lead
     that converts three pages later still carries its source. Copied into
     the booking form's hidden fields when the form opens. */
  var FT_KEY = 'bella_ft';
  var ft = null;
  try {
    ft = JSON.parse(sessionStorage.getItem(FT_KEY) || 'null');
    if (!ft) {
      var q = new URLSearchParams(location.search);
      ft = {
        utm_source: q.get('utm_source') || '', utm_medium: q.get('utm_medium') || '',
        utm_campaign: q.get('utm_campaign') || '', landing_page: location.pathname,
        referrer: document.referrer && document.referrer.indexOf(location.host) < 0 ? document.referrer.slice(0, 200) : ''
      };
      sessionStorage.setItem(FT_KEY, JSON.stringify(ft));
    }
    if (group === 'blog_post') sessionStorage.setItem('bella_article', slug);
  } catch (e) { ft = ft || {}; }
  function lastArticle() { try { return sessionStorage.getItem('bella_article') || ''; } catch (e) { return ''; } }

  /* Meta Pixel (standard base code) — skipped entirely without ad consent. */
  if (!allowAds) { window.fbq = function () {}; }
  else !function (f, b, e, v, n, t, s) {
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
        var extra = Object.assign({ entry_article: lastArticle() }, ft || {});
        Object.keys(extra).forEach(function (k) {
          if (!extra[k]) return;
          var el = form.elements[k];
          if (!el) { el = document.createElement('input'); el.type = 'hidden'; el.name = k; form.appendChild(el); }
          el.value = extra[k];
        });
      }
      track('demo_modal_open', { cta_location: where(a), plan: plan, page: slug });
      if (plan) track('select_plan', { plan: plan }, 'InitiateCheckout', { content_name: plan });
      return;
    }

    var href = a.getAttribute('href') || '';
    if (a.classList.contains('heroV2__pill')) {
      track('select_promotion', { promotion_name: 'bella_voice_new', creative_slot: 'home_hero_pill' });
    } else if (a.closest('.post-list, .posts, .post-card, article.card') || (group === 'blog_index' && /^\/blog\//.test(href))) {
      var cards = Array.prototype.slice.call(document.querySelectorAll('a[href^="/blog/"]'));
      track('select_content', { content_type: 'blog_post', item_id: href.split('/').pop(), index: cards.indexOf(a) + 1 });
    } else if (href === '/pricing' && group !== 'pricing') {
      track('select_content', { content_type: 'cta', item_id: 'see_pricing_from_' + slug });
    }
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
      entry_article: lastArticle(), currency: 'USD', value: value
    }, 'Lead', { currency: 'USD', value: value, content_name: plan || 'demo' });
  });

  // Owner-intent readers (the two posts written for practice owners) get a
  // user property and a Meta event, so they can be retargeted separately
  // from coordinators.
  var OWNER_POSTS = ['bonus-structures-that-dont-distort-behavior', 'hiring-a-treatment-coordinator'];
  if (group === 'blog_post') {
    var owner = OWNER_POSTS.indexOf(slug) > -1;
    if (owner) gtag('set', 'user_properties', { reader_type: 'owner' });
    fbq('trackCustom', 'ReadArticle', { article: slug, audience: owner ? 'owner' : 'coordinator' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // ROI calculator (/pricing): one event per visit, after the visitor stops dragging.
    var roi = ['roi-prod', 'roi-lift', 'roi-seats'].map(function (id) { return document.getElementById(id); });
    if (roi[0] && roi[1] && roi[2]) {
      var roiSent = false, roiT;
      roi.forEach(function (el) {
        el.addEventListener('change', function () {
          clearTimeout(roiT);
          roiT = setTimeout(function () {
            track('roi_calculated', { production: +roi[0].value, lift: +roi[1].value, seats: +roi[2].value });
            if (!roiSent) { fbq('trackCustom', 'ROICalculated'); roiSent = true; }
            var form = document.getElementById('demoForm');
            if (form) {
              [['roi_production', roi[0].value], ['roi_lift', roi[1].value], ['roi_seats', roi[2].value]].forEach(function (kv) {
                var el2 = form.elements[kv[0]];
                if (!el2) { el2 = document.createElement('input'); el2.type = 'hidden'; el2.name = kv[0]; form.appendChild(el2); }
                el2.value = kv[1];
              });
            }
          }, 800);
        });
      });
    }

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
