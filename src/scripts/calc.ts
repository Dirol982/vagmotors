// Order calculator: pick works per make, keep a pre-check, send it to a messenger.
type Item = { name: string; price: number };
type Make = { id: string; name: string; cats: { name: string; items: Item[] }[] };
type Line = { name: string; price: number };

const SERVICE_TEL = '+375296200421';
const TG = 'https://t.me/%2B375296200421';
const WA = 'https://wa.me/375296200421';
const STORE = 'vagmotors-precheck';

const root = document.querySelector<HTMLElement>('[data-calc]');
if (root) init(root);

function init(root: HTMLElement) {
  const data: Make[] = JSON.parse(root.querySelector('[data-calc-data]')!.textContent || '[]');
  const list = root.querySelector<HTMLElement>('[data-calc-list]')!;
  const catsEl = root.querySelector<HTMLElement>('[data-calc-cats]')!;
  const search = root.querySelector<HTMLInputElement>('[data-calc-search]')!;
  const check = root.querySelector<HTMLElement>('[data-check]')!;
  const itemsEl = check.querySelector<HTMLElement>('[data-check-items]')!;
  const emptyEl = check.querySelector<HTMLElement>('[data-check-empty]')!;
  const totalEl = check.querySelector<HTMLElement>('[data-check-total]')!;
  const makeEl = check.querySelector<HTMLElement>('[data-check-make]')!;
  const status = check.querySelector<HTMLElement>('[data-check-status]')!;
  const form = check.querySelector<HTMLFormElement>('[data-check-form]')!;
  const submit = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const backdrop = root.querySelector<HTMLElement>('[data-check-backdrop]')!;
  const fmt = new Intl.NumberFormat('ru-RU');

  let makeId = data[0]?.id ?? 'vw';
  let cat = data[0]?.cats[0]?.name ?? '';
  let lines: Line[] = [];

  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved && data.some((m) => m.id === saved.makeId)) {
      makeId = saved.makeId;
      lines = Array.isArray(saved.lines) ? saved.lines : [];
    }
  } catch (_) {}

  const make = () => data.find((m) => m.id === makeId)!;
  const save = () => {
    try {
      localStorage.setItem(STORE, JSON.stringify({ makeId, lines }));
    } catch (_) {}
  };
  const say = (text: string, kind = '') => {
    status.textContent = text;
    status.dataset.kind = kind;
  };
  const total = () => lines.reduce((s, l) => s + l.price, 0);

  const el = (tag: string, cls?: string, text?: string) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };
  const priceNode = (p: number) => {
    const s = el('span', 'calc__price num');
    s.append(el('small', '', 'от '), document.createTextNode(fmt.format(p)), el('small', '', ' руб.'));
    return s;
  };
  const icon = (d: string) => {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.5');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    svg.append(path);
    return svg;
  };
  const PLUS = 'M12 5v14M5 12h14';
  const TICK = 'm5 12.5 4.5 4.5L19 7.5';
  const CROSS = 'M6 6l12 12M18 6 6 18';

  /* ── category chips ── */
  const renderCats = () => {
    catsEl.replaceChildren();
    for (const c of make().cats) {
      const b = el('button', '', c.name) as HTMLButtonElement;
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(c.name === cat && !search.value.trim()));
      b.addEventListener('click', () => {
        cat = c.name;
        search.value = '';
        renderCats();
        renderList();
      });
      catsEl.append(b);
    }
  };

  /* ── work list ── */
  const has = (name: string) => lines.some((l) => l.name === name);
  const renderList = () => {
    const q = search.value.trim().toLowerCase();
    list.replaceChildren();
    const groups = q ? make().cats : make().cats.filter((c) => c.name === cat);
    const seen = new Set<string>();
    let count = 0;
    for (const g of groups) {
      const items = g.items.filter((it) => (!q || it.name.toLowerCase().includes(q)) && !(q && seen.has(it.name)));
      if (!items.length) continue;
      if (q) list.append(el('li', 'calc__group', g.name));
      for (const it of items) {
        seen.add(it.name);
        count++;
        const li = el('li');
        li.append(el('span', 'calc__name', it.name), priceNode(it.price));
        const b = el('button', 'calc__add') as HTMLButtonElement;
        b.type = 'button';
        const on = has(it.name);
        b.setAttribute('aria-pressed', String(on));
        b.setAttribute('aria-label', `${on ? 'Убрать из предчека' : 'Добавить в предчек'}: ${it.name}`);
        b.append(icon(on ? TICK : PLUS), document.createTextNode(on ? 'В предчеке' : 'Добавить'));
        b.addEventListener('click', () => toggle(it));
        li.append(b);
        list.append(li);
      }
    }
    if (!count) {
      const li = el('li', 'calc__none', `По запросу «${search.value.trim()}» ничего не нашли. Напишите нам — подскажем стоимость.`);
      list.append(li);
    }
  };

  /* ── pre-check ── */
  const renderCheck = () => {
    makeEl.textContent = make().name;
    itemsEl.replaceChildren();
    for (const l of lines) {
      const li = el('li');
      li.append(el('span', '', l.name));
      const p = el('span', 'check__p num', `${fmt.format(l.price)} руб.`);
      const rm = el('button', 'check__rm') as HTMLButtonElement;
      rm.type = 'button';
      rm.setAttribute('aria-label', `Удалить: ${l.name}`);
      rm.append(icon(CROSS));
      rm.addEventListener('click', () => remove(l.name, li));
      li.append(p, rm);
      itemsEl.append(li);
    }
    emptyEl.hidden = lines.length > 0;
    totalEl.textContent = fmt.format(total());
    check.querySelector<HTMLElement>('[data-check-sum]')!.hidden = lines.length === 0;
    check.querySelector<HTMLElement>('[data-check-dash]')!.hidden = lines.length > 0;
    submit.disabled = lines.length === 0;
    document.dispatchEvent(new CustomEvent('precheck:change', { detail: { count: lines.length, total: total() } }));
  };

  const toggle = (it: Item) => {
    if (has(it.name)) lines = lines.filter((l) => l.name !== it.name);
    else lines = [...lines, { name: it.name, price: it.price }];
    say('');
    save();
    renderList();
    renderCheck();
  };

  const remove = (name: string, li: HTMLElement) => {
    li.classList.add('is-out');
    setTimeout(() => {
      lines = lines.filter((l) => l.name !== name);
      save();
      renderList();
      renderCheck();
      (itemsEl.querySelector('.check__rm') as HTMLElement | null)?.focus() ?? form.querySelector<HTMLInputElement>('input')?.focus();
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260);
  };

  /* switching make re-prices the same works from that make's list */
  root.querySelectorAll<HTMLInputElement>('input[name="calc-make"]').forEach((r) => {
    if (r.value === makeId) r.checked = true;
    r.addEventListener('change', () => {
      makeId = r.value;
      const priceOf = new Map(make().cats.flatMap((c) => c.items.map((i) => [i.name, i.price] as const)));
      const dropped = lines.filter((l) => !priceOf.has(l.name)).map((l) => l.name);
      lines = lines.filter((l) => priceOf.has(l.name)).map((l) => ({ name: l.name, price: priceOf.get(l.name)! }));
      if (!make().cats.some((c) => c.name === cat)) cat = make().cats[0]?.name ?? '';
      save();
      renderCats();
      renderList();
      renderCheck();
      say(dropped.length ? `Пересчитали для ${make().name}. Нет в прайсе марки: ${dropped.join(', ')}.` : lines.length ? `Пересчитали цены для ${make().name}.` : '', dropped.length ? 'error' : 'ok');
    });
  });

  search.addEventListener('input', () => {
    renderCats();
    renderList();
  });

  check.querySelector('[data-check-clear]')!.addEventListener('click', () => {
    lines = [];
    save();
    renderList();
    renderCheck();
    say('Предчек очищен.');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!lines.length) {
      say('Добавьте хотя бы одну работу из списка.', 'error');
      return;
    }
    const fd = new FormData(form);
    const model = String(fd.get('model') || '').trim();
    const ch = String(fd.get('ch') || 'telegram');
    const text = [
      'Здравствуйте! Предчек с сайта VAGMOTORS.',
      `Марка: ${make().name}${model ? `, ${model}` : ''}`,
      ...lines.map((l, i) => `${i + 1}. ${l.name} — от ${fmt.format(l.price)} руб.`),
      `Итого работы: от ${fmt.format(total())} руб.`,
      'Подскажите точную стоимость и ближайшее время записи.',
    ].join('\n');
    const enc = encodeURIComponent(text);
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (_) {}
    if (ch === 'whatsapp') {
      window.open(`${WA}?text=${enc}`, '_blank', 'noopener');
      say('Открываем WhatsApp с предчеком — остаётся нажать «Отправить».', 'ok');
    } else if (ch === 'viber') {
      window.location.href = `viber://chat?number=${encodeURIComponent(SERVICE_TEL)}&draft=${enc}`;
      say(copied ? 'Открываем Viber. Предчек скопирован — если поле пустое, вставьте его.' : 'Открываем Viber.', 'ok');
    } else {
      window.open(TG, '_blank', 'noopener');
      say(copied ? 'Предчек скопирован. Вставьте его в открывшийся чат Telegram.' : 'Открываем Telegram — перечислите работы в сообщении.', 'ok');
    }
  });

  /* ── mobile bottom sheet ── */
  let lastFocus: HTMLElement | null = null;
  const sheetMq = matchMedia('(max-width: 1000px)');
  const open = () => {
    if (!sheetMq.matches) {
      check.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    lastFocus = document.activeElement as HTMLElement;
    check.classList.add('is-open');
    check.setAttribute('role', 'dialog');
    check.setAttribute('aria-modal', 'true');
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => check.querySelector<HTMLElement>('[data-check-close]')?.focus(), 50);
  };
  const close = () => {
    if (!check.classList.contains('is-open')) return;
    check.classList.remove('is-open');
    check.removeAttribute('role');
    check.removeAttribute('aria-modal');
    backdrop.hidden = true;
    document.body.style.overflow = '';
    lastFocus?.focus();
  };
  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('[data-check-open]')) {
      e.preventDefault();
      open();
    }
  });
  check.querySelector('[data-check-close]')!.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  sheetMq.addEventListener('change', () => close());

  const d = new Date();
  check.querySelector('[data-check-date]')!.textContent = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  renderCats();
  renderList();
  renderCheck();
}
