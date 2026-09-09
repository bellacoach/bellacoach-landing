/* Border glow — the pointer half of React Bits' BorderGlow.
   ---------------------------------------------------------------------------
   Everything visual is in glow.css. This does three things:

     tags every card it finds, injects the .edge-light span, and records the
     card's own corner radius so the ring matches an 18px card as well as a
     20px one;

     answers two questions per pointer frame — how close to an edge the pointer
     is (0-100) and at what angle it sits — and writes them as custom
     properties;

     does none of the above where there is no hover, since on touch the glow
     can never be seen.

   Adding a new card type is one entry in SELECTORS. Reads are batched into a
   rAF so a pointer crossing several cards cannot force layout on every move. */
(function () {
  var SELECTORS = [
    '.bento__cell',   /* index — what nobody else has */
    '.tier-card',     /* pricing — the three plans */
    '.roi-card',      /* pricing — the ROI calculator */
    '.post-card'      /* blog — the post list */
  ];

  if (!window.matchMedia || !window.matchMedia('(hover: hover)').matches) return;

  var cards = document.querySelectorAll(SELECTORS.join(','));
  if (!cards.length) return;

  var queued = false, target = null, px = 0, py = 0;

  function frame() {
    queued = false;
    if (!target) return;
    var r = target.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var cx = r.width / 2, cy = r.height / 2;
    var dx = (px - r.left) - cx, dy = (py - r.top) - cy;
    /* how far out toward the nearest edge the pointer is, 0 at dead centre
       and 1 at any edge, whichever axis runs out first */
    var kx = dx !== 0 ? cx / Math.abs(dx) : Infinity;
    var ky = dy !== 0 ? cy / Math.abs(dy) : Infinity;
    var edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    var deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (deg < 0) deg += 360;
    target.style.setProperty('--edge-proximity', (edge * 100).toFixed(2));
    target.style.setProperty('--cursor-angle', deg.toFixed(2) + 'deg');
  }

  function onMove(e) {
    target = e.currentTarget;
    px = e.clientX;
    py = e.clientY;
    if (queued) return;
    queued = true;
    requestAnimationFrame(frame);
  }

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    if (card.classList.contains('bglow')) continue;

    /* keep the ring on the card's own corner radius rather than a guess */
    var radius = window.getComputedStyle(card).borderTopLeftRadius;
    if (radius && radius !== '0px') card.style.setProperty('--glow-r', radius);

    var span = document.createElement('span');
    span.className = 'edge-light';
    span.setAttribute('aria-hidden', 'true');
    card.appendChild(span);

    card.classList.add('bglow');
    card.addEventListener('pointermove', onMove, { passive: true });
  }
})();
