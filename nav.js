/* Site menus (Products, Learn, Company): one open at a time. Click toggles on
   every device; on a mouse, hovering also opens, with a short grace period so
   the pointer can cross the gap to the panel. Esc, an outside click or
   following a link closes. Markup comes from scripts/build-nav.cjs. */
(function () {
  var menus = [].slice.call(document.querySelectorAll('[data-menu]'));
  if (!menus.length) return;
  var hover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function set(m, open) {
    m.classList.toggle('is-open', open);
    var b = m.querySelector('.nav-mm__btn');
    if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeAll(except) { menus.forEach(function (m) { if (m !== except) set(m, false); }); }

  menus.forEach(function (m) {
    var btn = m.querySelector('.nav-mm__btn');
    var timer;
    btn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var open = !m.classList.contains('is-open');
      closeAll(m); set(m, open);
    });
    m.addEventListener('click', function (e) { if (e.target.closest('a')) set(m, false); });
    if (hover) {
      m.addEventListener('mouseenter', function () { clearTimeout(timer); closeAll(m); set(m, true); });
      m.addEventListener('mouseleave', function () { timer = setTimeout(function () { set(m, false); }, 160); });
    }
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('[data-menu]')) closeAll(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = menus.filter(function (m) { return m.classList.contains('is-open'); })[0];
    closeAll();
    if (open) open.querySelector('.nav-mm__btn').focus();
  });
})();
