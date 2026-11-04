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
  if (header && !menuOpen) header.classList.toggle("is-hidden", y > 240 && y > lastY + 4);
  if (y < lastY - 4) header?.classList.remove("is-hidden");
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
      const to = Number(el.dataset.count ?? el.dataset.gauge ?? 1);
      if (el.dataset.count) {
        const render = (x) => el.textContent = fmt.format(Math.max(0, Math.round(x * to)));
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
    if (counter) counter.textContent = `${String(i + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
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
        window.location.href = `viber://chat?number=${encodeURIComponent(tel)}&draft=${enc}`;
        say(
          copied
            ? 'Открываем Viber. Текст заявки скопирован — если поле пустое, вставьте его в чат.'
            : 'Открываем Viber. Если приложение не открылось, напишите на ' + tel + '.',
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

// Order calculator and pre-check
(() => {
const SERVICE_TEL = "+375296200421";
const TG = "https://t.me/%2B375296200421";
const WA = "https://wa.me/375296200421";
const STORE = "vagmotors-precheck";
const root = document.querySelector("[data-calc]");
if (root) init(root);
function init(root2) {
  const data = JSON.parse(root2.querySelector("[data-calc-data]").textContent || "[]");
  const list = root2.querySelector("[data-calc-list]");
  const catsEl = root2.querySelector("[data-calc-cats]");
  const search = root2.querySelector("[data-calc-search]");
  const check = root2.querySelector("[data-check]");
  const itemsEl = check.querySelector("[data-check-items]");
  const emptyEl = check.querySelector("[data-check-empty]");
  const totalEl = check.querySelector("[data-check-total]");
  const makeEl = check.querySelector("[data-check-make]");
  const status = check.querySelector("[data-check-status]");
  const form = check.querySelector("[data-check-form]");
  const submit = form.querySelector("button[type=submit]");
  const backdrop = root2.querySelector("[data-check-backdrop]");
  const fmt = new Intl.NumberFormat("ru-RU");
  let makeId = data[0]?.id ?? "vw";
  let cat = data[0]?.cats[0]?.name ?? "";
  let lines = [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved && data.some((m) => m.id === saved.makeId)) {
      makeId = saved.makeId;
      lines = Array.isArray(saved.lines) ? saved.lines : [];
    }
  } catch (_) {
  }
  const make = () => data.find((m) => m.id === makeId);
  const save = () => {
    try {
      localStorage.setItem(STORE, JSON.stringify({ makeId, lines }));
    } catch (_) {
    }
  };
  const say = (text, kind = "") => {
    status.textContent = text;
    status.dataset.kind = kind;
  };
  const total = () => lines.reduce((s, l) => s + l.price, 0);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== void 0) e.textContent = text;
    return e;
  };
  const priceNode = (p) => {
    const s = el("span", "calc__price num");
    s.append(el("small", "", "\u043E\u0442 "), document.createTextNode(fmt.format(p)), el("small", "", "\xA0\u0440\u0443\u0431."));
    return s;
  };
  const icon = (d2) => {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.5");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", d2);
    svg.append(path);
    return svg;
  };
  const PLUS = "M12 5v14M5 12h14";
  const TICK = "m5 12.5 4.5 4.5L19 7.5";
  const CROSS = "M6 6l12 12M18 6 6 18";
  const renderCats = () => {
    catsEl.replaceChildren();
    for (const c of make().cats) {
      const b = el("button", "", c.name);
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(c.name === cat && !search.value.trim()));
      b.addEventListener("click", () => {
        cat = c.name;
        search.value = "";
        renderCats();
        renderList();
      });
      catsEl.append(b);
    }
  };
  const has = (name) => lines.some((l) => l.name === name);
  const renderList = () => {
    const q = search.value.trim().toLowerCase();
    list.replaceChildren();
    const groups = q ? make().cats : make().cats.filter((c) => c.name === cat);
    const seen = /* @__PURE__ */ new Set();
    let count = 0;
    for (const g of groups) {
      const items = g.items.filter((it) => (!q || it.name.toLowerCase().includes(q)) && !(q && seen.has(it.name)));
      if (!items.length) continue;
      if (q) list.append(el("li", "calc__group", g.name));
      for (const it of items) {
        seen.add(it.name);
        count++;
        const li = el("li");
        li.append(el("span", "calc__name", it.name), priceNode(it.price));
        const b = el("button", "calc__add");
        b.type = "button";
        const on = has(it.name);
        b.setAttribute("aria-pressed", String(on));
        b.setAttribute("aria-label", `${on ? "\u0423\u0431\u0440\u0430\u0442\u044C \u0438\u0437 \u043F\u0440\u0435\u0434\u0447\u0435\u043A\u0430" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u043F\u0440\u0435\u0434\u0447\u0435\u043A"}: ${it.name}`);
        b.append(icon(on ? TICK : PLUS), document.createTextNode(on ? "\u0412 \u043F\u0440\u0435\u0434\u0447\u0435\u043A\u0435" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C"));
        b.addEventListener("click", () => toggle(it));
        li.append(b);
        list.append(li);
      }
    }
    if (!count) {
      const li = el("li", "calc__none", `\u041F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443 \xAB${search.value.trim()}\xBB \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0448\u043B\u0438. \u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043D\u0430\u043C \u2014 \u043F\u043E\u0434\u0441\u043A\u0430\u0436\u0435\u043C \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C.`);
      list.append(li);
    }
  };
  const renderCheck = () => {
    makeEl.textContent = make().name;
    itemsEl.replaceChildren();
    for (const l of lines) {
      const li = el("li");
      li.append(el("span", "", l.name));
      const p = el("span", "check__p num", `${fmt.format(l.price)}\xA0\u0440\u0443\u0431.`);
      const rm = el("button", "check__rm");
      rm.type = "button";
      rm.setAttribute("aria-label", `\u0423\u0434\u0430\u043B\u0438\u0442\u044C: ${l.name}`);
      rm.append(icon(CROSS));
      rm.addEventListener("click", () => remove(l.name, li));
      li.append(p, rm);
      itemsEl.append(li);
    }
    emptyEl.hidden = lines.length > 0;
    totalEl.textContent = fmt.format(total());
    check.querySelector("[data-check-sum]").hidden = lines.length === 0;
    check.querySelector("[data-check-dash]").hidden = lines.length > 0;
    submit.disabled = lines.length === 0;
    document.dispatchEvent(new CustomEvent("precheck:change", { detail: { count: lines.length, total: total() } }));
  };
  const toggle = (it) => {
    if (has(it.name)) lines = lines.filter((l) => l.name !== it.name);
    else lines = [...lines, { name: it.name, price: it.price }];
    say("");
    save();
    renderList();
    renderCheck();
  };
  const remove = (name, li) => {
    li.classList.add("is-out");
    setTimeout(() => {
      lines = lines.filter((l) => l.name !== name);
      save();
      renderList();
      renderCheck();
      itemsEl.querySelector(".check__rm")?.focus() ?? form.querySelector("input")?.focus();
    }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 260);
  };
  root2.querySelectorAll('input[name="calc-make"]').forEach((r) => {
    if (r.value === makeId) r.checked = true;
    r.addEventListener("change", () => {
      makeId = r.value;
      const priceOf = new Map(make().cats.flatMap((c) => c.items.map((i) => [i.name, i.price])));
      const dropped = lines.filter((l) => !priceOf.has(l.name)).map((l) => l.name);
      lines = lines.filter((l) => priceOf.has(l.name)).map((l) => ({ name: l.name, price: priceOf.get(l.name) }));
      if (!make().cats.some((c) => c.name === cat)) cat = make().cats[0]?.name ?? "";
      save();
      renderCats();
      renderList();
      renderCheck();
      say(dropped.length ? `\u041F\u0435\u0440\u0435\u0441\u0447\u0438\u0442\u0430\u043B\u0438 \u0434\u043B\u044F ${make().name}. \u041D\u0435\u0442 \u0432 \u043F\u0440\u0430\u0439\u0441\u0435 \u043C\u0430\u0440\u043A\u0438: ${dropped.join(", ")}.` : lines.length ? `\u041F\u0435\u0440\u0435\u0441\u0447\u0438\u0442\u0430\u043B\u0438 \u0446\u0435\u043D\u044B \u0434\u043B\u044F ${make().name}.` : "", dropped.length ? "error" : "ok");
    });
  });
  search.addEventListener("input", () => {
    renderCats();
    renderList();
  });
  check.querySelector("[data-check-clear]").addEventListener("click", () => {
    lines = [];
    save();
    renderList();
    renderCheck();
    say("\u041F\u0440\u0435\u0434\u0447\u0435\u043A \u043E\u0447\u0438\u0449\u0435\u043D.");
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!lines.length) {
      say("\u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u0443 \u0440\u0430\u0431\u043E\u0442\u0443 \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430.", "error");
      return;
    }
    const fd = new FormData(form);
    const model = String(fd.get("model") || "").trim();
    const ch = String(fd.get("ch") || "telegram");
    const text = [
      "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435! \u041F\u0440\u0435\u0434\u0447\u0435\u043A \u0441 \u0441\u0430\u0439\u0442\u0430 VAGMOTORS.",
      `\u041C\u0430\u0440\u043A\u0430: ${make().name}${model ? `, ${model}` : ""}`,
      ...lines.map((l, i) => `${i + 1}. ${l.name} \u2014 \u043E\u0442 ${fmt.format(l.price)} \u0440\u0443\u0431.`),
      `\u0418\u0442\u043E\u0433\u043E \u0440\u0430\u0431\u043E\u0442\u044B: \u043E\u0442 ${fmt.format(total())} \u0440\u0443\u0431.`,
      "\u041F\u043E\u0434\u0441\u043A\u0430\u0436\u0438\u0442\u0435 \u0442\u043E\u0447\u043D\u0443\u044E \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0438 \u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0432\u0440\u0435\u043C\u044F \u0437\u0430\u043F\u0438\u0441\u0438."
    ].join("\n");
    const enc = encodeURIComponent(text);
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (_) {
    }
    if (ch === "whatsapp") {
      window.open(`${WA}?text=${enc}`, "_blank", "noopener");
      say("\u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u043C WhatsApp \u0441 \u043F\u0440\u0435\u0434\u0447\u0435\u043A\u043E\u043C \u2014 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043D\u0430\u0436\u0430\u0442\u044C \xAB\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C\xBB.", "ok");
    } else if (ch === "viber") {
      window.location.href = `viber://chat?number=${encodeURIComponent(SERVICE_TEL)}&draft=${enc}`;
      say(copied ? "\u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u043C Viber. \u041F\u0440\u0435\u0434\u0447\u0435\u043A \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D \u2014 \u0435\u0441\u043B\u0438 \u043F\u043E\u043B\u0435 \u043F\u0443\u0441\u0442\u043E\u0435, \u0432\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0435\u0433\u043E." : "\u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u043C Viber.", "ok");
    } else {
      window.open(TG, "_blank", "noopener");
      say(copied ? "\u041F\u0440\u0435\u0434\u0447\u0435\u043A \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D. \u0412\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0435\u0433\u043E \u0432 \u043E\u0442\u043A\u0440\u044B\u0432\u0448\u0438\u0439\u0441\u044F \u0447\u0430\u0442 Telegram." : "\u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u043C Telegram \u2014 \u043F\u0435\u0440\u0435\u0447\u0438\u0441\u043B\u0438\u0442\u0435 \u0440\u0430\u0431\u043E\u0442\u044B \u0432 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0438.", "ok");
    }
  });
  let lastFocus = null;
  const sheetMq = matchMedia("(max-width: 1000px)");
  const open = () => {
    if (!sheetMq.matches) {
      check.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    lastFocus = document.activeElement;
    check.classList.add("is-open");
    check.setAttribute("role", "dialog");
    check.setAttribute("aria-modal", "true");
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(() => check.querySelector("[data-check-close]")?.focus(), 50);
  };
  const close = () => {
    if (!check.classList.contains("is-open")) return;
    check.classList.remove("is-open");
    check.removeAttribute("role");
    check.removeAttribute("aria-modal");
    backdrop.hidden = true;
    document.body.style.overflow = "";
    lastFocus?.focus();
  };
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-check-open]")) {
      e.preventDefault();
      open();
    }
  });
  check.querySelector("[data-check-close]").addEventListener("click", close);
  backdrop.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  sheetMq.addEventListener("change", () => close());
  const d = /* @__PURE__ */ new Date();
  check.querySelector("[data-check-date]").textContent = d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  renderCats();
  renderList();
  renderCheck();
}
})();

// Mobile dock: pre-check summary
(() => {
const sum = document.querySelector("[data-dock-sum]");
const fmt = new Intl.NumberFormat("ru-RU");
document.addEventListener("precheck:change", (e) => {
  const { count, total } = e.detail;
  if (sum) sum.textContent = count ? `${count} \xB7 \u043E\u0442 ${fmt.format(total)} \u0440\u0443\u0431.` : "\u043F\u0443\u0441\u0442\u043E";
});
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
