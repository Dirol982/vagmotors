// Motion grammar for the showroom: lights switch on, things arrive with mass and settle.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Header: solid after the hero, hides on scroll down, returns on scroll up ── */
const header = document.querySelector<HTMLElement>('[data-header]');
const dock = document.querySelector<HTMLElement>('.dock');
let lastY = window.scrollY;
const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 24);
  const menuOpen = header?.querySelector('[data-menu-toggle]')?.getAttribute('aria-expanded') === 'true';
  if (header && !menuOpen) header.classList.toggle('is-hidden', y > 240 && y > lastY + 4);
  if (y < lastY - 4) header?.classList.remove('is-hidden');
  dock?.classList.toggle('is-shown', y > window.innerHeight * 0.9);
  lastY = y;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Mobile menu ── */
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const setMenu = (open: boolean) => {
  if (!toggle || !menu) return;
  toggle.setAttribute('aria-expanded', String(open));
  menu.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  header?.classList.toggle('is-scrolled', open || window.scrollY > 24);
};
toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu?.querySelectorAll('[data-menu-link]').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});

/* ── Open sign: lit from real Minsk time ── */
const minskHour = () => {
  const parts = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Minsk', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return h + m / 60;
};
const paintSigns = () => {
  const now = minskHour();
  document.querySelectorAll<HTMLElement>('[data-open-sign]').forEach((el) => {
    const open = Number(el.dataset.open);
    const close = Number(el.dataset.close);
    const isOpen = now >= open && now < close;
    el.classList.toggle('is-open', isOpen);
    el.classList.toggle('is-closed', !isOpen);
    const text = el.querySelector('[data-open-text]');
    if (text) text.textContent = isOpen ? `Открыто до ${close}:00` : `Закрыто · откроемся в ${open}:00`;
  });
};
paintSigns();
setInterval(paintSigns, 60_000);

/* ── Reveals ── */
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    }
  },
  { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
);
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

/* ── Damped values: numbers and gauges arrive with mass, overshoot a touch and settle ── */
type Spring = { x: number; v: number; target: number; el: HTMLElement; render: (x: number) => void };
const springs = new Set<Spring>();
let raf = 0;
const step = () => {
  const k = 120; // stiffness
  const c = 17; // damping (slightly under-damped)
  const dt = 1 / 60;
  for (const s of springs) {
    const a = -k * (s.x - s.target) - c * s.v;
    s.v += a * dt;
    s.x += s.v * dt;
    if (Math.abs(s.x - s.target) < 0.0005 && Math.abs(s.v) < 0.0005) {
      s.x = s.target;
      springs.delete(s);
    }
    s.render(s.x);
  }
  raf = springs.size ? requestAnimationFrame(step) : 0;
};
const animateTo = (s: Spring) => {
  springs.add(s);
  if (!raf) raf = requestAnimationFrame(step);
};

const fmt = new Intl.NumberFormat('ru-RU');
const springIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      springIO.unobserve(el);
      const to = Number(el.dataset.count ?? el.dataset.gauge ?? 1);
      if (el.dataset.count) {
        const render = (x: number) => (el.textContent = fmt.format(Math.max(0, Math.round(x * to))));
        if (reduce) render(1);
        else animateTo({ x: 0, v: 0, target: 1, el, render });
      } else {
        const render = (x: number) => el.style.setProperty('--g', String(Math.max(0, x * to)));
        if (reduce) render(1);
        else animateTo({ x: 0, v: 0, target: 1, el, render });
      }
    }
  },
  { threshold: 0.4 }
);
document.querySelectorAll<HTMLElement>('[data-count], [data-gauge]').forEach((el) => {
  if (!reduce) {
    if (el.dataset.count) el.textContent = '0';
    else el.style.setProperty('--g', '0');
  }
  springIO.observe(el);
});

/* ── Scroll-linked: hero parallax, DSG series drift, horizontal gallery ── */
const hero = document.querySelector<HTMLElement>('[data-hero]');
const drift = document.querySelectorAll<HTMLElement>('[data-drift]');
const rail = document.querySelector<HTMLElement>('[data-rail]');
const railTrack = rail?.querySelector<HTMLElement>('[data-rail-track]');
const railMq = matchMedia('(min-width: 900px)');

const sizeRail = () => {
  if (!rail || !railTrack) return;
  if (!railMq.matches || reduce) {
    rail.style.height = '';
    railTrack.style.transform = '';
    return;
  }
  const overflow = railTrack.scrollWidth - window.innerWidth;
  rail.style.height = `${window.innerHeight + Math.max(0, overflow)}px`;
};

let ticking = false;
const onFrame = () => {
  ticking = false;
  const vh = window.innerHeight;
  if (hero) {
    const p = Math.min(1, Math.max(0, window.scrollY / vh));
    hero.style.setProperty('--p', p.toFixed(4));
  }
  drift.forEach((el) => {
    const r = el.getBoundingClientRect();
    const p = (vh - r.top) / (vh + r.height);
    const dir = Number(el.dataset.drift || 1);
    el.style.transform = `translate3d(${(-(p - 0.5) * 30 * dir).toFixed(2)}%,0,0)`;
  });
  if (rail && railTrack && railMq.matches) {
    const r = rail.getBoundingClientRect();
    const total = rail.offsetHeight - vh;
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
    const overflow = railTrack.scrollWidth - window.innerWidth;
    railTrack.style.transform = `translate3d(${(-p * overflow).toFixed(1)}px,0,0)`;
    rail.style.setProperty('--rp', p.toFixed(4));
  }
};
if (!reduce) {
  sizeRail();
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onFrame);
      }
    },
    { passive: true }
  );
  window.addEventListener('resize', () => {
    sizeRail();
    onFrame();
  });
  window.addEventListener('load', () => {
    sizeRail();
    onFrame();
  });
  onFrame();
}

/* ── Service index: a photo follows the pointer over the list (fine pointers only) ── */
const index = document.querySelector<HTMLElement>('[data-index]');
const peek = index?.querySelector<HTMLElement>('[data-peek]');
if (index && peek && matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
  let tx = 0,
    ty = 0,
    x = 0,
    y = 0,
    running = false;
  const loop = () => {
    x += (tx - x) * 0.14;
    y += (ty - y) * 0.14;
    peek.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) requestAnimationFrame(loop);
    else running = false;
  };
  index.addEventListener('pointermove', (e) => {
    const r = index.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  });
  index.querySelectorAll<HTMLElement>('[data-peek-src]').forEach((row) => {
    row.addEventListener('pointerenter', () => {
      const id = row.dataset.peekSrc;
      peek.querySelectorAll<HTMLElement>('[data-peek-img]').forEach((img) => img.classList.toggle('is-on', img.dataset.peekImg === id));
      peek.classList.add('is-on');
    });
  });
  index.addEventListener('pointerleave', () => peek.classList.remove('is-on'));
}

/* ── Reviews: one quote at a time ── */
document.querySelectorAll<HTMLElement>('[data-quotes]').forEach((root) => {
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-quote]'));
  const counter = root.querySelector<HTMLElement>('[data-quote-n]');
  let i = 0;
  const show = (n: number) => {
    i = (n + items.length) % items.length;
    items.forEach((q, k) => {
      q.classList.toggle('is-on', k === i);
      q.setAttribute('aria-hidden', String(k !== i));
    });
    if (counter) counter.textContent = `${String(i + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
  };
  root.querySelector('[data-quote-prev]')?.addEventListener('click', () => show(i - 1));
  root.querySelector('[data-quote-next]')?.addEventListener('click', () => show(i + 1));
  show(0);
});
