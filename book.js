/* Booking: one way to ask for a walkthrough on every page.

   - Pages with their own demo modal (home and the three product pages) keep it.
   - Every other page (blog, hubs, about) gets the same modal injected here, so
     a reader books from the article instead of being sent to the homepage.
   - When BOOKING_URL is set, the modal leads with "Pick a time": Nick's Google
     Calendar booking page, opened in a new tab. The short form stays under it
     for anyone who would rather be contacted.

   Loaded with `defer`, so it runs after the page is parsed and before
   DOMContentLoaded. tracking.js opens the modal for /#book-demo on
   DOMContentLoaded, so the injected modal already exists by then.
   Lead tracking is unchanged: tracking.js fills the form's hidden fields on
   any [data-demo] click and fires generate_lead on the "bella:lead" event. */
(function () {
  // Google Calendar "Book a Demo" schedule (15 min) for nick@bellacoach.com, linked
  // directly so visitors don't land on the page that also lists "30 min with Nick".
  // Empty = no calendar option; the form works on its own.
  var BOOKING_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1JFmJC2-HYtzhejjlS4WhJ44fM8Kl3tkZ6oLjo4dbFra9QWrxFGvhAi1QWIoRAEFXhUQwxBzJ9';

  var CSS =
    '.bk-overlay{position:fixed;inset:0;z-index:120;background:rgba(28,25,23,.55);backdrop-filter:blur(3px);display:none;align-items:flex-start;justify-content:center;padding:48px 20px;overflow-y:auto}' +
    '.bk-overlay.open{display:flex}' +
    '.bk-card{background:var(--card,#fff);border-radius:22px;max-width:520px;width:100%;padding:40px 40px 36px;position:relative;box-shadow:0 40px 90px -30px rgba(28,25,23,.5);font-family:Inter,system-ui,sans-serif;line-height:1.5}' +
    '.bk-card h3{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:30px;line-height:1.15;color:var(--ink,#1c1917);letter-spacing:-.01em;margin:0}' +
    '.bk-card .msub{font-size:15.5px;color:var(--muted,#57534e);margin:12px 0 26px}' +
    '.bk-card label{display:block;margin:0 0 14px}' +
    '.bk-card input,.bk-card textarea{box-sizing:border-box;width:100%;font:15px Inter,system-ui,sans-serif;color:var(--ink,#1c1917);background:var(--card,#fff);border:1px solid var(--border,#e7e5e4);border-radius:12px;padding:14px 16px}' +
    '.bk-card input:focus,.bk-card textarea:focus{outline:none;border-color:var(--amber,#b45309)}' +
    '.bk-card textarea{resize:vertical;min-height:84px}' +
    '.bk-card .msubmit{width:100%;background:var(--ink,#1c1917);color:#fff;border:none;cursor:pointer;font:600 15px Inter,system-ui,sans-serif;padding:16px;border-radius:12px;margin-top:6px}' +
    '.bk-card .msubmit:hover{background:var(--amber-strong,#78350f)}' +
    '.bk-card .modal-close{position:absolute;top:18px;right:18px;width:34px;height:34px;border-radius:50%;border:none;background:var(--amber-soft,#fef6e7);color:var(--amber-text,#92400e);font-size:16px;cursor:pointer;display:grid;place-items:center}' +
    '.bk-card .mthanks{display:none;text-align:center;padding:18px 0 6px}' +
    '.bk-card .mthanks p{font-size:15.5px;color:var(--muted,#57534e)}' +
    '.bk-card.sent .mform{display:none}.bk-card.sent .mthanks{display:block}' +
    '.bk-cal{display:block;text-align:center;text-decoration:none;background:var(--amber,#b45309);color:#fff !important;font:600 15px Inter,system-ui,sans-serif;padding:16px;border-radius:12px}' +
    '.bk-cal:hover{background:var(--amber-strong,#78350f)}' +
    '.bk-cal-note{font-size:13.5px;color:var(--faint,#78716c);text-align:center;margin:10px 0 0}' +
    '.bk-or{display:flex;align-items:center;gap:12px;margin:24px 0 18px;font-size:13px;color:var(--faint,#78716c)}' +
    '.bk-or::before,.bk-or::after{content:"";flex:1;height:1px;background:var(--border,#e7e5e4)}' +
    '@media(max-width:540px){.bk-card{padding:32px 24px}}';

  var FORM =
    '<form id="demoForm" action="https://formspree.io/f/xykvbbjo" method="POST">' +
    '<input type="hidden" name="plan"><input type="hidden" name="source_page">' +
    '<label><input type="text" name="name" placeholder="Your name" aria-label="Your name" autocomplete="name" required></label>' +
    '<label><input type="email" name="email" placeholder="Email address" aria-label="Email address" autocomplete="email" required></label>' +
    '<label><input type="text" name="practice" placeholder="Practice name" aria-label="Practice name" autocomplete="organization"></label>' +
    '<label><input type="text" name="role" placeholder="Role (e.g., Owner, Regional Manager)" aria-label="Role"></label>' +
    '<label><textarea name="notes" placeholder="Anything we should know before the call?" aria-label="Notes"></textarea></label>' +
    '<button type="submit" class="msubmit">Request walkthrough</button>' +
    '</form>';

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var overlay = document.getElementById('demoModal');
  var card = document.getElementById('demoModalCard');
  var injected = !overlay;

  if (injected) {
    overlay = document.createElement('div');
    overlay.className = 'bk-overlay';
    overlay.id = 'demoModal';
    overlay.innerHTML =
      '<div class="bk-card" id="demoModalCard" role="dialog" aria-modal="true" aria-labelledby="bkTitle">' +
      '<button class="modal-close" type="button" aria-label="Close">&#10005;</button>' +
      '<div class="mform"><h3 id="bkTitle">Book a walkthrough</h3>' +
      '<p class="msub">Tell us a bit about your practice. We&#8217;ll be in touch within 24 hours to schedule 15 minutes.</p>' +
      FORM + '</div>' +
      '<div class="mthanks"><h3>Thanks, we&#8217;ll be in touch.</h3><p>We&#8217;ll reach out within 24 hours to schedule your 15 minutes.</p></div>' +
      '</div>';
    document.body.appendChild(overlay);
    card = document.getElementById('demoModalCard');

    var lastFocus = null;
    var open = function (e) {
      if (e) e.preventDefault();
      lastFocus = document.activeElement;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      var first = card.querySelector('.bk-cal, input[name="name"]');
      if (first) first.focus();
    };
    var close = function () {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    // Bubble phase, so tracking.js (capture phase) fills the hidden fields first.
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('[data-demo]');
      if (a) open(e);
    });
    card.querySelector('.modal-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });

    var form = document.getElementById('demoForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.msubmit'), orig = btn.textContent;
      btn.textContent = 'Sending…'; btn.disabled = true;
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('status ' + res.status);
          card.classList.add('sent');
          document.dispatchEvent(new CustomEvent('bella:lead', { detail: { form: form } }));
        })
        .catch(function () {
          btn.textContent = orig; btn.disabled = false;
          alert('That didn’t send. Please try again, or email nick@bellacoach.com.');
        });
    });
  }

  // "Pick a time" goes first in whichever modal the page has.
  if (BOOKING_URL && card) {
    var mform = card.querySelector('.mform');
    var sub = mform && mform.querySelector('.msub');
    if (mform && sub) {
      sub.textContent = 'Fifteen minutes, a live treatment-plan conversation, and your questions. Pick a time that suits you.';
      var block = document.createElement('div');
      block.innerHTML =
        '<a class="bk-cal" href="' + BOOKING_URL + '" target="_blank" rel="noopener">Pick a time on the calendar</a>' +
        '<p class="bk-cal-note">Opens Google Calendar. You get the invite straight away.</p>' +
        '<div class="bk-or">or have us reach out within 24 hours</div>';
      sub.parentNode.insertBefore(block, sub.nextSibling);
      // Opening the calendar is intent, not a booking: GA4 only, no Meta
      // "Schedule" (that would count bookings that never happened). Real
      // bookings arrive as Google Calendar invites and go in the lead log.
      block.querySelector('.bk-cal').addEventListener('click', function () {
        if (window.bellaTrack) {
          var page = location.pathname.replace(/\.html$/, '').split('/').pop() || 'home';
          window.bellaTrack('booking_calendar_open', { page: page });
        }
      });
    }
  }
})();
