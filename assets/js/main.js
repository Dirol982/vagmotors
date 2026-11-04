// Motion, header, mobile menu, open sign, reveals, springs, gallery
(() => {
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-header]");
const dock = document.querySelector(".dock");
let lastY = window.scrollY;
const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 24);
  const menuOpen = header?.querySelector("[data-menu-toggle]")?.getAttribute("aria-expanded") === "true";
  dock?.classList.toggle("is-shown", y > window.innerHeight * 0.9);
  lastY = y;
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
const toggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const setMenu = (open) => {
  if (!toggle || !menu) return;
  toggle.setAttribute("aria-expanded", String(open));
  menu.hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
  header?.classList.toggle("is-scrolled", open || window.scrollY > 24);
};
toggle?.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
menu?.querySelectorAll("[data-menu-link]").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    toggle.focus();
  }
});
const minskHour = () => {
  const parts = new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Minsk", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(/* @__PURE__ */ new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h + m / 60;
};
const paintSigns = () => {
  const now = minskHour();
  document.querySelectorAll("[data-open-sign]").forEach((el) => {
    const open = Number(el.dataset.open);
    const close = Number(el.dataset.close);
    const isOpen = now >= open && now < close;
    el.classList.toggle("is-open", isOpen);
    el.classList.toggle("is-closed", !isOpen);
    const text = el.querySelector("[data-open-text]");
    if (text) text.textContent = isOpen ? `\u041E\u0442\u043A\u0440\u044B\u0442\u043E \u0434\u043E ${close}:00` : `\u0417\u0430\u043A\u0440\u044B\u0442\u043E \xB7 \u043E\u0442\u043A\u0440\u043E\u0435\u043C\u0441\u044F \u0432 ${open}:00`;
  });
};
paintSigns();
setInterval(paintSigns, 6e4);
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    }
  },
  { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
);
document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
// A jump past a section (menu link, fast scroll) never makes it intersect; reveal everything already above the fold line.
let revealTick = false;
const revealPassed = () => {
  revealTick = false;
  const line = window.innerHeight * 0.9;
  document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => {
    if (el.getBoundingClientRect().top < line) {
      el.classList.add("is-in");
      io.unobserve(el);
    }
  });
  // figures jumped past show their true value instead of a frozen zero
  document.querySelectorAll("[data-count]:not([data-done]), [data-gauge]:not([data-done])").forEach((el) => {
    if (el.getBoundingClientRect().bottom < 0) {
      el.dataset.done = "1";
      if (el.dataset.count) el.textContent = new Intl.NumberFormat("ru-RU").format(Number(el.dataset.count));
      else el.style.setProperty("--g", el.dataset.gauge);
    }
  });
};
window.addEventListener("scroll", () => {
  if (!revealTick) {
    revealTick = true;
    requestAnimationFrame(revealPassed);
  }
}, { passive: true });
window.addEventListener("hashchange", revealPassed);
const springs = /* @__PURE__ */ new Set();
let raf = 0;
const step = () => {
  const k = 120;
  const c = 17;
  const dt = 1 / 60;
  for (const s of springs) {
    const a = -k * (s.x - s.target) - c * s.v;
    s.v += a * dt;
    s.x += s.v * dt;
    if (Math.abs(s.x - s.target) < 5e-4 && Math.abs(s.v) < 5e-4) {
      s.x = s.target;
      springs.delete(s);
    }
    s.render(s.x);
  }
  raf = springs.size ? requestAnimationFrame(step) : 0;
};
const animateTo = (s) => {
  springs.add(s);
  if (!raf) raf = requestAnimationFrame(step);
};
const fmt = new Intl.NumberFormat("ru-RU");
const springIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      springIO.unobserve(el);
      el.dataset.done = "1";
      const to = Number(el.dataset.count ?? el.dataset.gauge ?? 1);
      if (el.dataset.count) {
        // a figure never reads past its true value, however the spring overshoots
        const render = (x) => el.textContent = fmt.format(Math.max(0, Math.round(Math.min(1, x) * to)));
        if (reduce) render(1);
        else animateTo({ x: 0, v: 0, target: 1, el, render });
      } else {
        const render = (x) => el.style.setProperty("--g", String(Math.max(0, x * to)));
        if (reduce) render(1);
        else animateTo({ x: 0, v: 0, target: 1, el, render });
      }
    }
  },
  { threshold: 0.4 }
);
document.querySelectorAll("[data-count], [data-gauge]").forEach((el) => {
  if (!reduce) {
    if (el.dataset.count) el.textContent = "0";
    else el.style.setProperty("--g", "0");
  }
  springIO.observe(el);
});
const hero = document.querySelector("[data-hero]");
const drift = document.querySelectorAll("[data-drift]");
const rail = document.querySelector("[data-rail]");
const railTrack = rail?.querySelector("[data-rail-track]");
const railMq = matchMedia("(min-width: 900px)");
const sizeRail = () => {
  if (!rail || !railTrack) return;
  if (!railMq.matches || reduce) {
    rail.style.height = "";
    railTrack.style.transform = "";
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
    hero.style.setProperty("--p", p.toFixed(4));
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
    rail.style.setProperty("--rp", p.toFixed(4));
  }
};
if (!reduce) {
  sizeRail();
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onFrame);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", () => {
    sizeRail();
    onFrame();
  });
  window.addEventListener("load", () => {
    sizeRail();
    onFrame();
  });
  onFrame();
}
const index = document.querySelector("[data-index]");
const peek = index?.querySelector("[data-peek]");
if (index && peek && matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce) {
  let tx = 0, ty = 0, x = 0, y = 0, running = false;
  const loop = () => {
    x += (tx - x) * 0.14;
    y += (ty - y) * 0.14;
    peek.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) requestAnimationFrame(loop);
    else running = false;
  };
  index.addEventListener("pointermove", (e) => {
    const r = index.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  });
  index.querySelectorAll("[data-peek-src]").forEach((row) => {
    row.addEventListener("pointerenter", () => {
      const id = row.dataset.peekSrc;
      peek.querySelectorAll("[data-peek-img]").forEach((img) => img.classList.toggle("is-on", img.dataset.peekImg === id));
      peek.classList.add("is-on");
    });
  });
  index.addEventListener("pointerleave", () => peek.classList.remove("is-on"));
}
document.querySelectorAll("[data-quotes]").forEach((root) => {
  const items = Array.from(root.querySelectorAll("[data-quote]"));
  const counter = root.querySelector("[data-quote-n]");
  let i = 0;
  const show = (n) => {
    i = (n + items.length) % items.length;
    items.forEach((q, k) => {
      q.classList.toggle("is-on", k === i);
      q.setAttribute("aria-hidden", String(k !== i));
    });
    if (counter) counter.textContent = `${i + 1} из ${items.length}`;
  };
  root.querySelector("[data-quote-prev]")?.addEventListener("click", () => show(i - 1));
  root.querySelector("[data-quote-next]")?.addEventListener("click", () => show(i + 1));
  show(0);
});
})();

// Booking configurator in the first viewport
(() => {
  const tel = '+375296200421';
  const tg = 'https://t.me/%2B375296200421';
  const wa = 'https://wa.me/375296200421';

  (() => {
    const form = document.querySelector('[data-booking]');
    if (!form) return;
    const status = form.querySelector('[data-booking-status]');
    const initial = status.innerHTML;

    const say = (html, kind) => {
      status.innerHTML = html;
      status.dataset.kind = kind || '';
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const make = data.get('make');
      const model = (data.get('model') || '').toString().trim();
      const task = (data.get('task') || '').toString().trim();
      const channel = data.get('channel') || 'telegram';

      if (!make) {
        say('Выберите марку автомобиля — так мастер сразу поймёт, с чем работать.', 'error');
        form.querySelector('input[name="make"]').focus();
        return;
      }
      if (!task) {
        say('Напишите коротко, что нужно сделать: например, «ТО» или «рывки при переключении».', 'error');
        form.querySelector('#b-task').focus();
        return;
      }

      const lines = [
        'Здравствуйте! Хочу записаться на СТО.',
        `Марка: ${make}`,
        model && `Модель: ${model}`,
        `Задача: ${task}`,
      ].filter(Boolean);
      const text = lines.join('\n');
      const enc = encodeURIComponent(text);

      let copied = false;
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (_) {}

      if (channel === 'whatsapp') {
        window.open(`${wa}?text=${enc}`, '_blank', 'noopener');
        say('Открываем WhatsApp с готовым текстом заявки. Остаётся нажать «Отправить».', 'ok');
      } else if (channel === 'viber') {
        // Viber cuts a draft at 100 characters: send one compact line, or no draft and the copied full text
        const short = `Запись на СТО: ${make}${model ? ' ' + model : ''} — ${task}`;
        const fits = short.length <= 100;
        window.location.href = `viber://chat?number=${encodeURIComponent(tel)}` + (fits ? `&draft=${encodeURIComponent(short)}` : '');
        say(
          fits
            ? 'Открываем Viber с готовой заявкой — остаётся нажать «Отправить».'
            : copied
              ? 'Открываем Viber. Заявка длинная, поэтому мы её скопировали — вставьте в чат (Ctrl+V или долгое нажатие) и отправьте.'
              : 'Открываем Viber. Напишите марку, модель и задачу — ответим в рабочее время.',
          'ok'
        );
      } else {
        window.open(tg, '_blank', 'noopener');
        say(
          copied
            ? 'Текст заявки скопирован. Вставьте его в открывшийся чат Telegram и отправьте.'
            : 'Открываем Telegram. Напишите марку, модель и задачу — ответим в рабочее время.',
          'ok'
        );
      }
    });

    form.addEventListener('input', () => {
      if (status.dataset.kind === 'error') say(initial, '');
    });

    // Any [data-pick-make] on the page loads that make into the configurator.
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-pick-make], [data-pick-task]');
      if (!t) return;
      e.preventDefault();
      const id = t.getAttribute('data-pick-make');
      const task = t.getAttribute('data-pick-task');
      if (id) {
        const r = form.querySelector(`input[data-make-id="${id}"]`);
        if (r) r.checked = true;
      }
      if (task) form.querySelector('#b-task').value = task;
      form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      form.classList.remove('is-pinged');
      void form.offsetWidth;
      form.classList.add('is-pinged');
      setTimeout(() => form.querySelector(id && !task ? '#b-task' : '#b-model').focus({ preventScroll: true }), 650);
    });
  })();
})();

// Order calculator and pre-check (modelled on the rs-auto calculator)
(() => {
  const root = document.querySelector('[data-calc]');
  if (!root) return;

  const SERVICE_TEL = '+375296200421';
  const TG = 'https://t.me/%2B375296200421';
  const WA = 'https://wa.me/375296200421';
  const STORE = 'vagmotors-precheck-v2';
  const MAKE_NAMES = { vw: 'Volkswagen', audi: 'Audi', skoda: 'Škoda' };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LIMIT = matchMedia('(max-width: 720px)').matches ? 4 : 8;
  const fmt = new Intl.NumberFormat('ru-RU');

  // One tap adds the usual works for a complaint (only works present in the selected make's price list)
  const SYM = [
    ['Пора на ТО', [['ТО', 1], ['Замена масла в двигателе', 1], ['Замена воздушного фильтра', 1], ['Замена салонного фильтра', 1]], 'Техническое обслуживание'],
    ['Рывки DSG', [['Диагностика и ремонт ДСГ', 1], ['Замена масла в ДСГ', 1]], 'Ремонт КПП'],
    ['Горит Check Engine', [['Компьютерная диагностика', 1], ['Диагностика двигателя', 1]], 'Диагностика'],
    ['Стучит подвеска', [['Диагностика подвески', 1], ['Замена стоек и втулок стабилизатора', 1]], 'Ремонт подвески'],
    ['Скрипят тормоза', [['Диагностика тормозов', 1], ['Замена тормозных колодок', 1]], 'Ремонт тормозов'],
    ['Уходит антифриз', [['Поиск утечки антифриза', 1], ['Диагностика системы охлаждения', 1]], 'Ремонт системы охлаждения'],
    ['Не холодит кондиционер', [['Диагностика и ремонт кондиционера', 1], ['Заправка кондиционера', 1]], 'Ремонт отопителя и кондиционера'],
    ['Покупаю машину', [['Диагностика перед покупкой', 1]], 'Диагностика'],
  ];

  const data = JSON.parse(root.querySelector('[data-calc-data]').textContent || '[]');
  const $ = (s, el = root) => el.querySelector(s);
  const itemsEl = $('[data-calc-items]');
  const catsEl = $('[data-calc-cats]');
  const symEl = $('[data-calc-sym]');
  const footEl = $('[data-calc-foot]');
  const foundEl = $('[data-calc-found]');
  const search = $('[data-calc-search]');
  const check = $('[data-check]');
  const linesEl = $('[data-check-lines]');
  const sumEl = $('[data-check-sum]');
  const metaEl = $('[data-check-meta]');
  const clearBtn = $('[data-check-clear]');
  const bookEl = $('[data-check-book]');
  const submitBtn = $('[data-check-submit]');
  const backdrop = $('[data-check-backdrop]');
  const toastEl = $('[data-toast]');
  const dockSum = document.querySelector('[data-dock-sum]');
  const dockEmpty = document.querySelector('[data-dock-empty]');
  const dockFull = document.querySelector('[data-dock-full]');

  let make = 'vw';
  let cat = '';
  let query = '';
  let expanded = false;
  let picked = new Map(); // name → qty
  let shown = 0;

  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved && MAKE_NAMES[saved.make]) {
      make = saved.make;
      picked = new Map(saved.picked || []);
    }
  } catch (_) {}

  const book = () => data.find((m) => m.id === make);
  const priceMap = () => new Map(book().cats.flatMap((c) => c.items.map((i) => [i.name, i.price])));
  const total = () => {
    const pm = priceMap();
    let s = 0;
    picked.forEach((q, n) => (s += (pm.get(n) || 0) * q));
    return s;
  };
  const save = () => {
    try {
      localStorage.setItem(STORE, JSON.stringify({ make, picked: [...picked] }));
    } catch (_) {}
  };
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const norm = (t) => t.toLowerCase().replace(/ё/g, 'е');
  const toast = (m) => {
    toastEl.textContent = m;
    toastEl.classList.add('is-on');
    clearTimeout(toastEl._h);
    toastEl._h = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
  };

  const allCount = () => new Set(data.flatMap((m) => m.cats.flatMap((c) => c.items.map((i) => i.name)))).size;
  const countEl = $('[data-calc-count]');
  if (countEl) countEl.textContent = String(allCount());

  /* ── complaints ── */
  const renderSym = () => {
    const pm = priceMap();
    symEl.innerHTML = SYM.map(([label, works], i) => {
      const ok = works.some(([n]) => pm.has(n));
      const done = ok && works.filter(([n]) => pm.has(n)).every(([n]) => picked.has(n));
      return ok ? `<button type="button" data-i="${i}" class="${done ? 'is-done' : ''}">+ ${esc(label)}</button>` : '';
    }).join('');
  };

  /* ── categories ── */
  const renderCats = () => {
    catsEl.innerHTML = book()
      .cats.map((c) => {
        const n = c.items.filter((it) => picked.has(it.name)).length;
        const sel = c.name === cat && !query;
        return `<button type="button" role="tab" aria-selected="${sel}" data-c="${esc(c.name)}">${esc(c.name)}${
          n ? `<i class="is-picked">${n}</i>` : `<i>${c.items.length}</i>`
        }</button>`;
      })
      .join('');
  };

  /* ── works ── */
  const renderItems = () => {
    const q = norm(query.trim());
    let list;
    let label;
    if (q) {
      const stems = q.split(/\s+/).filter(Boolean).map((w) => (w.length > 5 ? w.slice(0, -2) : w));
      const seen = new Set();
      list = book()
        .cats.flatMap((c) => c.items)
        .filter((it) => !seen.has(it.name) && seen.add(it.name) && stems.every((w) => norm(it.name).includes(w)));
      foundEl.textContent = list.length ? `Найдено: ${list.length}` : '';
      label = 'результатов';
    } else {
      list = (book().cats.find((c) => c.name === cat) || book().cats[0]).items;
      foundEl.textContent = '';
      label = 'работ в разделе';
    }
    const show = expanded ? list : list.slice(0, LIMIT);
    itemsEl.innerHTML = show.length
      ? show
          .map(
            (it) =>
              `<button type="button" class="calc__item" data-n="${esc(it.name)}" aria-pressed="${picked.has(it.name)}"><span class="calc__box" aria-hidden="true"></span><span class="calc__nm">${esc(
                it.name
              )}</span><span class="calc__pr num"><small>от</small>${fmt.format(it.price)} руб.</span></button>`
          )
          .join('')
      : `<p class="calc__none">По запросу «${esc(query.trim())}» ничего не нашли. Попробуйте другое слово — «колодки», «ГРМ», «сцепление» — или выберите раздел выше.</p>`;
    const rest = list.length - show.length;
    footEl.innerHTML =
      (rest > 0
        ? `<button type="button" data-more>Ещё ${rest} ${label} ↓</button>`
        : expanded && list.length > LIMIT
          ? '<button type="button" data-more>Свернуть ↑</button>'
          : '<span></span>') + `<span>Не видите нужную работу? <a data-to-search>Найдите поиском</a> или спросите мастера</span>`;
  };

  /* ── receipt ── */
  const animateSum = (from, to) => {
    const paint = (v) => {
      sumEl.textContent = fmt.format(v);
      if (dockSum) dockSum.textContent = fmt.format(v);
    };
    if (reduce) return paint(to);
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 500);
      paint(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const renderCheck = () => {
    const pm = priceMap();
    const lines = [...picked].filter(([n]) => pm.has(n));
    linesEl.innerHTML = lines.length
      ? lines
          .map(
            ([n, q]) =>
              `<li data-n="${esc(n)}"><span>${esc(n)}</span><span class="check__qty"><button type="button" data-q="-1" aria-label="Меньше: ${esc(
                n
              )}">−</button><b>${q}</b><button type="button" data-q="1" aria-label="Больше: ${esc(n)}">+</button></span><span class="check__p">${fmt.format(
                pm.get(n) * q
              )}</span><button type="button" class="check__rm" aria-label="Удалить: ${esc(
                n
              )}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></li>`
          )
          .join('')
      : '<li class="check__empty">Отметьте работы слева или нажмите на то, что беспокоит.</li>';
    const sum = total();
    animateSum(shown, sum);
    shown = sum;
    clearBtn.hidden = !lines.length;
    metaEl.textContent = `VAGMOTORS · ${MAKE_NAMES[make]} · работ: ${lines.length}`;
    if (dockEmpty && dockFull) {
      dockEmpty.hidden = lines.length > 0;
      dockFull.hidden = lines.length === 0;
    }
  };

  const refresh = () => {
    save();
    renderSym();
    renderCats();
    renderItems();
    renderCheck();
  };

  /* ── events ── */
  catsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    cat = b.dataset.c;
    query = '';
    search.value = '';
    expanded = false;
    renderCats();
    renderItems();
  });

  search.addEventListener('input', () => {
    query = search.value;
    expanded = false;
    renderCats();
    renderItems();
  });

  itemsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-n]');
    if (!b) return;
    const n = b.dataset.n;
    if (picked.has(n)) picked.delete(n);
    else picked.set(n, 1);
    refresh();
  });

  footEl.addEventListener('click', (e) => {
    if (e.target.closest('[data-more]')) {
      expanded = !expanded;
      renderItems();
    }
    if (e.target.closest('[data-to-search]')) {
      search.focus();
      search.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    }
  });

  symEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    const [, works, c] = SYM[Number(b.dataset.i)];
    const pm = priceMap();
    const added = works.filter(([n]) => pm.has(n));
    added.forEach(([n, q]) => picked.set(n, Math.max(q, picked.get(n) || 0)));
    if (book().cats.some((x) => x.name === c)) cat = c;
    query = '';
    search.value = '';
    expanded = true;
    refresh();
    added.forEach(([n]) => itemsEl.querySelector(`[data-n="${CSS.escape(n)}"]`)?.classList.add('is-flash'));
    toast(`Добавили в расчёт: ${added.map(([n]) => n.toLowerCase()).join(', ')}`);
  });

  linesEl.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-n]');
    if (!li) return;
    const n = li.dataset.n;
    if (e.target.closest('.check__rm')) {
      li.classList.add('is-out');
      setTimeout(() => {
        picked.delete(n);
        refresh();
        toast(`Убрали: ${n.toLowerCase()}`);
      }, reduce ? 0 : 220);
      return;
    }
    const b = e.target.closest('[data-q]');
    if (b) {
      const q = picked.get(n) + Number(b.dataset.q);
      if (q < 1) picked.delete(n);
      else picked.set(n, Math.min(q, 20));
      refresh();
    }
  });

  clearBtn.addEventListener('click', () => {
    picked.clear();
    bookEl.hidden = true;
    submitBtn.textContent = 'Записаться с этим расчётом';
    refresh();
    toast('Расчёт очищен');
  });

  root.querySelectorAll('input[name="calc-make"]').forEach((r) => {
    r.checked = r.value === make;
    r.addEventListener('change', () => {
      make = r.value;
      const pm = priceMap();
      const dropped = [...picked.keys()].filter((n) => !pm.has(n));
      dropped.forEach((n) => picked.delete(n));
      if (!book().cats.some((c) => c.name === cat)) cat = book().cats[0].name;
      refresh();
      toast(
        dropped.length
          ? `Цены пересчитаны для ${MAKE_NAMES[make]}. Нет в прайсе марки: ${dropped.join(', ').toLowerCase()}`
          : picked.size
            ? `Цены пересчитаны для ${MAKE_NAMES[make]}`
            : `Прайс ${MAKE_NAMES[make]}`
      );
    });
  });

  /* ── visit day and time (open daily 9–21, Minsk time) ── */
  const daysEl = $('[data-check-days]');
  const slotsEl = $('[data-check-slots]');
  const WD = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const minsk = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Minsk' }));
  const startToday = minsk.getHours() < 19;
  const days = [];
  for (let i = startToday ? 0 : 1; days.length < 7; i++) {
    const d = new Date(minsk);
    d.setDate(minsk.getDate() + i);
    const title = i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : WD[d.getDay()];
    days.push({ title, sub: d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace('.', '') });
  }
  daysEl.innerHTML = days.map((d, i) => `<button type="button" aria-pressed="${i === 0}">${d.title}<small>${d.sub}</small></button>`).join('');
  slotsEl.innerHTML = ['Утро 9–12', 'День 12–16', 'Вечер 16–21']
    .map((s, i) => `<button type="button" aria-pressed="${i === 0}">${s}</button>`)
    .join('');
  [daysEl, slotsEl].forEach((g) =>
    g.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      [...g.children].forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    })
  );

  const receiptText = () => {
    const pm = priceMap();
    const lines = [...picked].filter(([n]) => pm.has(n));
    const model = String(new FormData(check).get('model') || '').trim();
    const day = daysEl.querySelector('[aria-pressed="true"]');
    const slot = slotsEl.querySelector('[aria-pressed="true"]');
    return [
      'Здравствуйте! Расчёт с сайта VAGMOTORS.',
      `Марка: ${MAKE_NAMES[make]}${model ? `, ${model}` : ''}`,
      ...lines.map(([n, q], i) => `${i + 1}. ${n}${q > 1 ? ` × ${q}` : ''} — от ${fmt.format(pm.get(n) * q)} руб.`),
      `Итого работы: от ${fmt.format(total())} руб.`,
      !bookEl.hidden && day && slot ? `Удобно: ${day.firstChild.textContent} ${day.querySelector('small').textContent}, ${slot.textContent}` : '',
      'Подскажите точную стоимость и подтвердите время записи.',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.append(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (_) {}
      ta.remove();
      return ok;
    }
  };

  $('[data-check-copy]').addEventListener('click', async () => {
    if (!picked.size) return toast('Сначала добавьте работы в расчёт');
    toast((await copy(receiptText())) ? 'Расчёт скопирован — вставьте его в мессенджер' : 'Не получилось скопировать автоматически');
  });

  check.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!picked.size) {
      toast('Сначала добавьте работы в расчёт');
      return;
    }
    if (bookEl.hidden) {
      bookEl.hidden = false;
      submitBtn.textContent = 'Отправить расчёт мастеру';
      check.querySelector('#check-model').focus();
      return;
    }
    const text = receiptText();
    const ch = String(new FormData(check).get('ch') || 'telegram');
    const copied = await copy(text);
    const enc = encodeURIComponent(text);
    if (ch === 'whatsapp') {
      window.open(`${WA}?text=${enc}`, '_blank', 'noopener');
      toast('Открываем WhatsApp с расчётом — остаётся нажать «Отправить»');
    } else if (ch === 'viber') {
      // Viber cuts a draft at 100 characters, so the estimate goes through the clipboard
      const pm = priceMap();
      const n = [...picked].filter(([k]) => pm.has(k)).length;
      const short = `Расчёт с сайта: ${MAKE_NAMES[make]}, работ ${n}, от ${fmt.format(total())} руб. Список ниже:`;
      window.location.href = `viber://chat?number=${encodeURIComponent(SERVICE_TEL)}&draft=${encodeURIComponent(short.slice(0, 100))}`;
      toast(
        copied
          ? 'Открываем Viber. Полный расчёт скопирован — вставьте его в чат (Ctrl+V или долгое нажатие) и отправьте'
          : 'Открываем Viber. Скопируйте расчёт кнопкой «Скопировать расчёт» и вставьте в чат'
      );
    } else {
      window.open(TG, '_blank', 'noopener');
      toast(copied ? 'Расчёт скопирован — вставьте его в открывшийся чат Telegram' : 'Открываем Telegram');
    }
  });

  /* ── mobile bottom sheet ── */
  const sheetMq = matchMedia('(max-width: 1000px)');
  let lastFocus = null;
  const open = () => {
    if (!sheetMq.matches) {
      check.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    lastFocus = document.activeElement;
    check.classList.add('is-open');
    check.setAttribute('role', 'dialog');
    check.setAttribute('aria-modal', 'true');
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('[data-check-close]').focus(), 50);
  };
  const close = () => {
    if (!check.classList.contains('is-open')) return;
    check.classList.remove('is-open');
    check.removeAttribute('role');
    check.removeAttribute('aria-modal');
    backdrop.hidden = true;
    document.body.style.overflow = '';
    lastFocus?.focus?.();
  };
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-check-open]')) {
      e.preventDefault();
      open();
    }
  });
  $('[data-check-close]').addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
  sheetMq.addEventListener('change', close);

  cat = book().cats[0].name;
  refresh();
})();

// Price page: make tabs and search
(() => {
const root = document.querySelector("[data-pricelist]");
if (root) {
  const tabs = Array.from(root.querySelectorAll("[data-tab]"));
  const panels = Array.from(root.querySelectorAll("[data-panel]"));
  const search = root.querySelector("[data-search]");
  const select = (id, focus = false) => {
    tabs.forEach((t) => {
      const on = t.dataset.tab === id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach((p) => p.hidden = p.dataset.panel !== id);
    filter();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t.dataset.tab));
    t.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      select(tabs[(i + d + tabs.length) % tabs.length].dataset.tab, true);
    });
  });
  const filter = () => {
    const q = (search?.value || "").trim().toLowerCase();
    const panel = panels.find((p) => !p.hidden);
    if (!panel) return;
    let any = false;
    panel.querySelectorAll("[data-group]").forEach((g) => {
      let shown = 0;
      g.querySelectorAll("[data-row]").forEach((r) => {
        const hit = !q || r.textContent.toLowerCase().includes(q);
        r.hidden = !hit;
        if (hit) shown++;
      });
      g.hidden = shown === 0;
      if (shown) any = true;
    });
    const empty = panel.querySelector("[data-empty]");
    if (empty) empty.hidden = any;
  };
  search?.addEventListener("input", filter);
  const fromHash = location.hash.slice(1).split("-")[0];
  if (tabs.some((t) => t.dataset.tab === fromHash)) select(fromHash);
}
})();

// YouTube: the player loads only when asked for (no third-party load before the click)
document.querySelectorAll("[data-yt]").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (link.classList.contains("is-playing")) return;
    const f = document.createElement("iframe");
    f.src = `https://www.youtube-nocookie.com/embed/${link.dataset.yt}?autoplay=1&rel=0`;
    f.title = link.dataset.ytTitle || "Видео";
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    f.allowFullscreen = true;
    link.classList.add("is-playing");
    link.removeAttribute("href");
    link.append(f);
    f.focus();
  });
});
