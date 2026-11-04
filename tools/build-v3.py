# Собирает v3 («Доска мастера-приёмщика»): v3/index.html и v3/price.html из tools/v3data.json и прайса price.html.
# Запуск из корня репозитория: python3 tools/build-v3.py
import json, html
D = json.load(open('tools/v3data.json', encoding='utf-8'))
e = html.escape
IMG = '../assets/img/'
def img(name, alt, w=1440, h=1920, lazy=True, sizes='50vw', cls=''):
    return (f'<img src="{IMG}{name}.webp" srcset="{IMG}{name}-720.webp 720w, {IMG}{name}.webp 1440w" sizes="{sizes}" '
            f'alt="{e(alt)}" width="{w}" height="{h}"' + (' loading="lazy" decoding="async"' if lazy else ' fetchpriority="high"') + (f' class="{cls}"' if cls else '') + '>')
ARROW = '<svg class="arrow" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 20h28M22 8l12 12-12 12"/></svg>'
SM_ARR = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>'
SM_LEFT = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H4m6-6-6 6 6 6"/></svg>'
PHONE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.2 3.5h3l1.6 4.2-2 1.4a11 11 0 0 0 7.1 7.1l1.4-2 4.2 1.6v3a1.7 1.7 0 0 1-1.8 1.7C10.6 20 4 13.4 3.5 5.3a1.7 1.7 0 0 1 1.7-1.8Z"/></svg>'
NAME = '<b>VAG</b>MOTORS'

def head(title, desc, url):
    return f'''<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="format-detection" content="telephone=no">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#1c1c1c">
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<link rel="icon" type="image/png" href="../favicon.png">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">
<link rel="preload" href="assets/fonts/wix-madefor-display-cyrillic-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/v3.css">
<script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')</script>
</head>
<body>
<a class="skip" href="#main">К содержанию</a>
'''

def bar(home=True):
    p = '' if home else 'index.html'
    links = [('#services','Услуги'),('#calc','Калькулятор'),('#dsg','DSG'),('#warranty','Гарантия'),('price.html','Цены'),('#reviews','Отзывы'),('#contacts','Контакты')]
    def h(x): return x if x.startswith('price') else (x if home else 'index.html'+x)
    nav = ''.join(f'<li><a href="{h(a)}">{t}</a></li>' for a,t in links)
    menu = ''.join(f'<a href="{h(a)}" data-menu-link>{t}</a>' for a,t in links) + f'<a class="t-red" href="{h("#book")}" data-menu-link>Записаться</a>'
    return f'''<header class="bar{'' if home else ' is-scrolled'}" data-header>
  <div class="bar__in">
    <a class="bar__logo" href="./" aria-label="VAGMOTORS — на главную"><img src="{IMG}logo-light.webp" alt="" width="320" height="130"></a>
    <ul class="bar__nav">{nav}</ul>
    <a class="bar__tel num" href="tel:+375296200421">+375 29 620-04-21</a>
    <a class="btn" href="{h('#book')}">Записаться</a>
    <button class="bar__burger" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle><span class="sr-only">Меню</span>
      <svg class="i-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M3 8h18M3 16h18"/></svg>
      <svg class="i-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg>
    </button>
  </div>
  <nav class="menu" id="menu" data-menu hidden aria-label="Меню">{menu}</nav>
</header>
'''

def dock(home=True):
    if home:
        return f'''<nav class="dock" aria-label="Быстрая связь">
  <button type="button" class="dock__sum" data-check-open aria-controls="precheck"><small>Ваш расчёт</small><b class="num"><span data-dock-empty>пока пусто</span><span data-dock-full hidden>от <span data-dock-sum>0</span> руб.</span></b></button>
  <a href="tel:+375296200421" class="dock__call" aria-label="Позвонить: +375 29 620-04-21">{PHONE}</a>
  <button type="button" class="dock__book" data-check-open aria-controls="precheck">Предчек</button>
</nav>
'''
    return f'''<nav class="dock" aria-label="Быстрая связь">
  <a href="tel:+375296200421" class="dock__call dock__call--wide">{PHONE} Позвонить</a>
  <a href="index.html#calc" class="dock__book">Калькулятор</a>
</nav>
'''

def footer(home=True):
    h = (lambda x: x) if home else (lambda x: 'index.html'+x)
    return f'''<footer class="board foot" aria-label="Подвал">
  <div class="tile foot__say">
    <p>Независимый специализированный сервис Volkswagen, Audi, Škoda, SEAT, Porsche и Bentley в центре Минска.</p>
    <p class="small muted">© <span data-year>2026</span> ООО «ВАГМОТОРС», УНП 193087869. Названия и товарные знаки марок принадлежат их владельцам.</p>
  </div>
  <nav class="tile foot__nav" aria-label="Разделы">
    <ul>
      <li><a href="{h('#services')}">Услуги</a></li><li><a href="{h('#calc')}">Калькулятор</a></li><li><a href="{h('#dsg')}">Ремонт DSG</a></li>
      <li><a href="price.html">Цены</a></li><li><a href="{h('#reviews')}">Отзывы</a></li><li><a href="{h('#business')}">Для юрлиц</a></li>
    </ul>
  </nav>
  <div class="tile foot__time t-dark">
    <p class="small muted">Минск, сейчас</p>
    <b class="num" data-minsk-clock>—</b>
    <p class="small muted">Ежедневно 9:00–21:00</p>
  </div>
  <div class="tile foot__mail">
    <div class="foot__social small"><a href="https://www.instagram.com/vagmotorsby/" target="_blank" rel="noopener">Instagram</a><a href="https://vk.com/vagmotorsby" target="_blank" rel="noopener">ВКонтакте</a><a href="https://t.me/VagMotors_Service" target="_blank" rel="noopener">Telegram</a><a href="https://www.youtube.com/@VAG-Motors" target="_blank" rel="noopener">YouTube</a></div>
    <a href="mailto:info@vagmotors.by">info@vagmotors.by</a>
  </div>
  <div class="tile foot__mark" aria-hidden="true"><span>{NAME}</span></div>
  <a class="tile t-red foot__cta" href="{h('#book')}">Записаться на&nbsp;СТО{ARROW}</a>
</footer>
'''

# ───────── index ─────────
svc_rows = ''.join(f'''<li><a href="#book" data-pick-task="{e(s['task'])}"><h3>{e(s['name'])}</h3><p>{e(s['note'])}</p><span class="svc__price num"><small>от</small> {e(s['price'].replace('от ','').replace(' руб.',''))}&nbsp;<small>руб.</small></span></a></li>''' for s in D['svc'][:5])
svc_rows2 = ''.join(f'''<li><a href="#book" data-pick-task="{e(s['task'])}"><h3>{e(s['name'])}</h3><p>{e(s['note'])}</p><span class="svc__price num"><small>от</small> {e(s['price'].replace('от ','').replace(' руб.',''))}&nbsp;<small>руб.</small></span></a></li>''' for s in D['svc'][5:])

quotes = ''
for i, r in enumerate(D['rev']):
    on = ' is-on' if i == 0 else ''
    quotes += f'''<figure class="quote{on}" data-quote aria-hidden="{'false' if i==0 else 'true'}">
    <figcaption class="quote__who"><div><strong>{e(r['name'])}</strong><span>{e(r['meta'])}</span></div></figcaption>
    <div class="quote__text"><blockquote><p>«{r['text']}»</p></blockquote></div>
  </figure>'''
# quotes JS expects single prev/next/n: keep only first set inside first? use shared nav outside
gallery = [
 ('m-tall',[('audi-a3-hall','Audi A3 и Volkswagen Caddy в цеху VAGMOTORS')]),
 ('m-pair',[('vas-6150d','Дилерский диагностический комплекс VAS 6150D'),('camshafts','Распредвалы и цепь ГРМ')]),
 ('m-wide',[('golf-gti-lift','Golf GTI на подъёмнике')]),
 ('m-pair',[('vw-oil-service','Оригинальное масло Volkswagen'),('porsche-macan','Porsche Macan в цеху')]),
 ('m-tall',[('skoda-diagnostics','Компьютерная диагностика Škoda')]),
 ('m-wide',[('cayenne-lift','Porsche Cayenne на подъёмнике')]),
 ('m-pair',[('vw-engine-bay','Разборка моторного отсека'),('vw-oil-shelf','Запчасти и жидкости на складе')]),
]
strip = ''
for cls, pics in gallery:
    inner = ''.join(img(n, a, sizes='40vw') for n, a in pics)
    strip += f'<figure class="{cls}">{inner}</figure>'
photo_names = ['audi-a3-hall','vas-6150d','golf-gti-lift','camshafts','porsche-macan','vw-oil-service','skoda-diagnostics','cayenne-lift','vw-engine-bay','vw-oil-shelf','audi-s6-lift']
pstrip = ''.join(f'<img src="{IMG}{n}-720.webp" alt="" width="720" height="960" loading="lazy" decoding="async">' for n in photo_names*2)

makes = [('vw','Volkswagen','Golf, Passat, Tiguan, Touareg'),('audi','Audi','A3–A8, Q3–Q8, S и RS'),('skoda','Škoda','Octavia, Superb, Kodiaq'),('porsche','Porsche','Macan, Cayenne, Panamera'),('seat','SEAT','Leon, Ateca, Alhambra'),('bentley','Bentley','Bentayga, Continental')]
make_tiles = ''.join(f'<a class="tile" href="#book" data-pick-make="{i}" data-reveal style="--d:{k}"><span class="make-name">{n}</span><span class="small muted">{e(m)}</span></a>' for k,(i,n,m) in enumerate(makes))

idx = head('VAGMOTORS — сервис Volkswagen, Audi, Škoda, SEAT, Porsche в центре Минска',
           'Специализированный сервисный центр VAG в центре Минска: диагностика, ТО, ремонт DSG, двигателя и подвески. Калькулятор работ, гарантия до 12 месяцев. Ежедневно 9:00–21:00.',
           'https://dirol982.github.io/vagmotors/v3/') + bar(True) + f'''<main id="main">

<section class="board hero" aria-labelledby="hero-title">
  <div class="tile band" aria-hidden="true"><span class="band__name">{NAME}</span></div>
  <div class="tile hero__links"><a href="#calc">Рассчитать стоимость</a></div>
  <div class="tile hero__links"><a href="price.html">Цены на работы</a></div>
  <div class="tile hero__links"><a href="#dsg">Ремонт DSG</a></div>
  <div class="tile hero__links"><a href="#contacts">Адрес и телефоны</a></div>
  <div class="hero__left">
    <div class="tile tile--photo">{img('vas-6150d','Дилерский диагностический комплекс VAS 6150D', lazy=False, sizes='(max-width: 760px) 50vw, 17vw')}</div>
    <ul class="tile facts">
      <li>Только автомобили концерна VAG</li>
      <li>Дилерская диагностика VAS 6150D</li>
      <li>Оригинальные и лицензионные запчасти</li>
      <li>Ремонт можно наблюдать</li>
      <li>Эвакуатор, кофе и Wi‑Fi</li>
    </ul>
  </div>
  <div class="tile tile--photo hero__main">
    {img('audi-a3-hall','Audi A3 и Volkswagen Golf на подъёмниках в цеху VAGMOTORS', lazy=False, sizes='(max-width: 760px) 100vw, 66vw')}
    <div class="hero__statement">
      <h1 id="hero-title">Ремонт Volkswagen, Audi, Škoda, SEAT, Porsche и&nbsp;Bentley в&nbsp;центре Минска</h1>
      <p>От замены лампочки до капитального ремонта двигателя. Технология завода, гарантия до 12&nbsp;месяцев.</p>
    </div>
  </div>
  <div class="hero__rail">
    <div class="tile t-concrete2" data-open-sign data-open="9" data-close="21"><span class="lamp"><i aria-hidden="true"></i><span data-open-text>Ежедневно 9–21</span></span><br>1-й Твёрдый пер., 11</div>
    <div class="tile t-concrete"><span class="rail-fig num">20 000 км</span>гарантии на ремонт с оригинальными деталями</div>
    <div class="tile t-sage"><span class="rail-fig">DSG</span>DQ200 · DQ250 · DQ500 · DL501 · DL382</div>
    <a class="tile t-dark" href="tel:+375296200421" style="text-decoration:none"><span class="rail-fig num" style="font-size:1.25rem">+375 29 620‑04‑21</span>сервис · Telegram, Viber, WhatsApp</a>
    <a class="tile t-red" href="#book">Записаться на&nbsp;СТО{ARROW}</a>
  </div>
</section>

<section class="board svc" id="services" aria-labelledby="services-title">
  <div class="tile t-concrete svc__cell">
    <h2 class="zig" id="services-title" data-reveal><span>От лампочки</span><span>до</span><span>капремонта</span></h2>
    <div class="svc__foot">
      <p data-reveal style="--d:1">Цена зависит от модели, двигателя и коробки, поэтому здесь указан минимум. Точную назовём по марке, году и VIN.</p>
      <a class="btn btn--ink" href="price.html" data-reveal style="--d:2">Весь прайс{SM_ARR}</a>
    </div>
  </div>
  <ul class="svc__rows" role="list">{svc_rows}{svc_rows2}</ul>
</section>

<section class="board calc" id="calc" aria-labelledby="calc-title" data-calc>
  <script type="application/json" data-calc-data>{D['calc']}</script>
  <div class="tile t-sage calc__title">
    <h2 class="head" id="calc-title" data-reveal>Заказ-наряд</h2>
    <p class="small">Калькулятор работ по прайсу VAGMOTORS</p>
  </div>
  <div class="tile calc__intro">
    <p class="lead">Нажмите на то, что беспокоит, — подставим типовые работы. Или отметьте их сами: <span data-calc-count>89</span>&nbsp;работ с ценами. Точную стоимость мастер согласует до начала ремонта.</p>
  </div>
  <div class="tile calc__panel">
    <div class="calc__top">
      <div class="cseg" role="radiogroup" aria-label="Марка">
        <label class="cseg__item"><input type="radio" name="calc-make" value="vw" checked><span>Volkswagen</span></label>
        <label class="cseg__item"><input type="radio" name="calc-make" value="audi"><span>Audi</span></label>
        <label class="cseg__item"><input type="radio" name="calc-make" value="skoda"><span>Škoda</span></label>
      </div>
      <small class="calc__hint">Porsche, SEAT, Bentley — выберите ближайшую марку, точную цену назовём</small>
    </div>
    <label class="calc__search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4"/></svg><span class="sr-only">Поиск работы</span><input type="search" placeholder="Найти работу: колодки, ГРМ, сцепление ДСГ…" autocomplete="off" data-calc-search><span class="calc__found num" data-calc-found aria-live="polite"></span></label>
    <div class="calc__sym"><span class="calc__sym-l">Что беспокоит?</span><div class="calc__sym-row" data-calc-sym></div></div>
    <div class="calc__cats" role="tablist" aria-label="Раздел прайса" data-calc-cats></div>
    <div class="calc__items" data-calc-items></div>
    <div class="calc__foot" data-calc-foot></div>
  </div>
  <div class="calc__backdrop" data-check-backdrop hidden></div>
  <div class="tile check-wrap">
    <form class="check" id="precheck" aria-labelledby="check-title" data-check novalidate>
      <div class="check__top">
        <h3 id="check-title">Предварительный расчёт</h3>
        <button type="button" class="check__clear" data-check-clear hidden>Очистить</button>
        <button type="button" class="check__close" data-check-close aria-label="Свернуть расчёт"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg></button>
      </div>
      <p class="check__meta" data-check-meta>VAGMOTORS · Volkswagen · работ: 0</p>
      <ul class="check__lines" role="list" data-check-lines></ul>
      <div class="check__total"><span>Итого</span><strong class="num"><small>от</small> <span data-check-sum>0</span> <small>руб.</small></strong></div>
      <p class="check__fine">Ориентировочная стоимость работ без запчастей. Точную цену назовём по модели, двигателю и VIN — согласуем до начала ремонта.</p>
      <div class="check__book" data-check-book hidden>
        <label class="check__label" for="check-model">Модель, год, двигатель</label>
        <input id="check-model" class="check__input" name="model" type="text" placeholder="Например, Golf 7 2016, 1.4 TSI" autocomplete="off">
        <span class="check__label">Когда удобно</span>
        <div class="check__days" data-check-days></div>
        <div class="check__slots" data-check-slots></div>
        <span class="check__label">Куда отправить</span>
        <div class="check__ch" role="radiogroup" aria-label="Куда отправить">
          <label><input type="radio" name="ch" value="telegram" checked><span>Telegram</span></label>
          <label><input type="radio" name="ch" value="viber"><span>Viber</span></label>
          <label><input type="radio" name="ch" value="whatsapp"><span>WhatsApp</span></label>
        </div>
      </div>
      <button class="btn check__submit" type="submit" data-check-submit>Записаться с этим расчётом</button>
      <div class="check__row"><button type="button" class="check__copy" data-check-copy>Скопировать расчёт</button><a class="num" href="tel:+375296200421">+375 29 620-04-21</a></div>
    </form>
  </div>
  <div class="toast" data-toast role="status" aria-live="polite"></div>
</section>

<section id="dsg" aria-labelledby="dsg-title">
  <div class="mosaic" style="background-image:url('{IMG}audi-s6-lift.webp')">
    <div class="tile t-concrete"><h2 id="dsg-title">Ремонт DSG и&nbsp;S&nbsp;tronic</h2><span class="small">Узкая специализация на VAG</span></div>
    <span></span><span class="m-hide"></span>
    <div class="tile t-dark fact"><b>DQ200 · DQ250</b>DQ500 · DL501 · DL382 — знаем слабые места каждой серии</div>
    <span></span><span class="m-hide"></span>
    <span class="m-hide"></span><span></span>
    <div class="tile t-sage fact"><b>Мехатроник</b>ремонт плат, гидравлики и прошивка</div>
    <span></span>
    <div class="tile t-concrete2 fact"><b>от 50 руб.</b>компьютерная и механическая диагностика</div>
    <span class="m-hide"></span>
    <span></span><span class="m-hide"></span><span></span>
    <div class="tile t-dark fact m-hide"><b>LUK, Sachs</b>и оригинальные комплекты сцепления</div>
    <span></span>
    <a class="tile t-red" href="#book" data-pick-task="Диагностика и ремонт DSG">Записаться на&nbsp;диагностику DSG{ARROW}</a>
  </div>
  <div class="board dsg-more">
    <div class="tile"><h3>Что делаем</h3><ul><li>Диагностика: давление в гидросистеме, пакеты сцепления</li><li>Мехатроник: платы, гидравлика, ошибки по давлению</li><li>Сцепление со специнструментом для зазоров</li><li>Двухмассовый маховик: шумы и вибрации</li></ul></div>
    <div class="tile t-concrete2"><h3>Когда пора к нам</h3><ul><li>Рывки и толчки при переключении, особенно 1–2</li><li>Вибрации при начале движения</li><li>Коробка уходит в аварийный режим</li><li>Пропали чётные или нечётные передачи</li><li>Лязг или скрежет при работе</li></ul></div>
    <div class="tile t-dark"><h3>Почему не откладывать</h3><p>Неисправность одного узла DSG быстро выводит из строя другие. Дилерское ПО и специнструмент для настройки, официальная гарантия на работу и детали.</p></div>
  </div>
</section>

<section class="board" id="warranty" aria-labelledby="warranty-title">
  <div class="tile warranty">
    <table class="wtable">
      <thead><tr>
        <th scope="col"><span class="wt-title" id="warranty-title">Гарантия в&nbsp;километрах</span></th>
        <th scope="col"><span class="wt-plan">ТО и регулировка</span><span class="wt-km num"><span data-count="2000">2&nbsp;000</span>&nbsp;км</span></th>
        <th scope="col"><span class="wt-plan">Лицензионные запчасти</span><span class="wt-km num"><span data-count="10000">10&nbsp;000</span>&nbsp;км</span></th>
        <th scope="col" class="is-best"><span class="wt-plan">Оригинальные запчасти</span><span class="wt-km num"><span data-count="20000">20&nbsp;000</span>&nbsp;км</span></th>
      </tr></thead>
      <tbody>
        <tr><th scope="row">Срок</th><td>1 месяц</td><td>6 месяцев</td><td class="is-best">12 месяцев</td></tr>
        <tr><th scope="row">На что</th><td>Техобслуживание и&nbsp;регулировочно-наладочные работы</td><td>Ремонт с нашими лицензионными запчастями</td><td class="is-best">Ремонт с нашими оригинальными запчастями</td></tr>
        <tr><th scope="row">Что раньше</th><td>Срок или пробег</td><td>Срок или пробег</td><td class="is-best">Срок или пробег</td></tr>
      </tbody>
    </table>
    <div class="wlist" aria-hidden="true">
      <div class="tile t-dark"><span class="wt-plan">ТО и регулировка</span><span class="wt-km num">2&nbsp;000&nbsp;км</span><p>или 1 месяц · техобслуживание и регулировочно-наладочные работы</p></div>
      <div class="tile t-dark"><span class="wt-plan">Лицензионные запчасти</span><span class="wt-km num">10&nbsp;000&nbsp;км</span><p>или 6 месяцев · ремонт с нашими лицензионными запчастями</p></div>
      <div class="tile t-concrete"><span class="wt-plan">Оригинальные запчасти</span><span class="wt-km num">20&nbsp;000&nbsp;км</span><p>или 12 месяцев · ремонт с нашими оригинальными запчастями</p></div>
    </div>
    <p class="wnote">Ремонт с запчастями клиента — гарантия только на работу: 1 месяц или 2&nbsp;000&nbsp;км пробега.</p>
  </div>
</section>

<section class="board makes" aria-labelledby="makes-title">
  <div class="tile t-red makes__head"><h2 id="makes-title">Шесть марок одного концерна</h2><span class="small">Нажмите на марку — подставим её в запись</span></div>
  {make_tiles}
</section>

<div class="marquee" aria-hidden="true"><div class="marquee__track"><span>1-й Твёрдый переулок, 11 · ежедневно 9:00–21:00 · VAGMOTORS ·</span><span>1-й Твёрдый переулок, 11 · ежедневно 9:00–21:00 · VAGMOTORS ·</span></div></div>

<section class="workshop" id="workshop" aria-labelledby="workshop-title" data-swipe>
  <div class="strip-head">
    <h2 id="workshop-title">Наш цех</h2>
    <div class="strip-nav"><span class="num">11 фото · листайте</span><button type="button" class="strip-btn" data-swipe-prev aria-label="Предыдущие фото">{SM_LEFT}</button><button type="button" class="strip-btn" data-swipe-next aria-label="Следующие фото">{SM_ARR}</button></div>
  </div>
  <div class="strip" data-swipe-track tabindex="0" role="region" aria-label="Фото цеха: листайте пальцем, мышью или стрелками">{strip}</div>
  <div class="strip-bar" data-swipe-bar aria-hidden="true"><span></span></div>
</section>

<section id="reviews" aria-labelledby="reviews-title">
  <div class="quotes" data-quotes>
    <h2 class="quotes__title" id="reviews-title">Что говорят владельцы</h2>
    {quotes}
    <div class="quote__nav"><button type="button" data-quote-prev aria-label="Предыдущий отзыв">{SM_LEFT}</button><span class="num" data-quote-n>1 из {len(D['rev'])}</span><button type="button" data-quote-next aria-label="Следующий отзыв">{SM_ARR}</button></div>
  </div>
  <div class="board"><p class="tile quote__links" style="grid-column:1/-1">Все отзывы: <a href="https://yandex.by/maps/org/vag_motors/10551282929/reviews/?ll=27.601528%2C53.908665&amp;z=16" target="_blank" rel="noopener">Яндекс Карты</a><a href="https://www.google.by/search?q=%D0%B2%D0%B0%D0%B3%D0%BC%D0%BE%D1%82%D0%BE%D1%80%D1%81+%D0%BC%D0%B8%D0%BD%D1%81%D0%BA#lrd=0x46dbcf9fa720bf4d:0xb7ecc47dd3aa4bc3,1,,," target="_blank" rel="noopener">Google</a><a href="https://vk.com/topic-170976131_39353822" target="_blank" rel="noopener">ВКонтакте</a></p></div>
</section>

<section class="board" id="about" aria-labelledby="about-title">
  <div class="tile about__head"><h2 id="about-title" data-reveal>Сервис изнутри</h2></div>
  <div class="tile t-dark about__lead"><p class="lead" data-reveal>Мы постоянно информируем о ходе работ и согласовываем каждое действие с вами. Оригинальные и лицензионные запчасти только от проверенных поставщиков и официальных импортёров.</p></div>
  <a class="tile yt" href="https://www.youtube.com/watch?v=qMt1-gWE-QI" target="_blank" rel="noopener" data-yt="qMt1-gWE-QI" data-yt-title="СТО VAG Motors — ремонт Volkswagen, Audi, Skoda, Porsche и Seat" aria-label="Смотреть видео «СТО VAG Motors — ремонт Volkswagen, Audi, Skoda, Porsche и Seat»">
    {img('golf-gti-lift','', sizes='(max-width: 1100px) 100vw, 66vw')}
    <span class="yt__play"><i aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></i>Ролик о станции с нашего канала</span>
  </a>
  <div class="tile place">
    <div class="tile t-concrete place__map">
      <p class="lead">Минск, 1-й Твёрдый переулок, 11, корпус&nbsp;3</p>
      <a class="link" href="https://yandex.by/maps/org/vag_motors/10551282929/?ll=27.601528%2C53.908665&amp;z=16" target="_blank" rel="noopener">Построить маршрут{SM_ARR}</a>
    </div>
    <dl class="place__facts">
      <div><dt>Часы</dt><dd class="num">Ежедневно 9:00–21:00</dd></div>
      <div><dt>Автомобили</dt><dd>2006 года и новее</dd></div>
      <div><dt>Запчасти</dt><dd>Продаём с установкой у нас</dd></div>
      <div><dt>Ожидание</dt><dd>Кофе и Wi‑Fi, эвакуатор</dd></div>
    </dl>
  </div>
  <div class="tile t-concrete2 biz" id="business">
    <div><h2>Для компаний и автопарков</h2><ul><li>Наличный и безналичный расчёт, работа с НДС</li><li>Единичные машины и корпоративные парки</li><li>Возьмём и машины не из концерна VAG — есть сертификат на большинство марок в Беларуси</li></ul></div>
    <details class="req"><summary>Реквизиты</summary><dl>
      <div><dt>Организация</dt><dd>Общество с ограниченной ответственностью «ВАГМОТОРС»</dd></div>
      <div><dt>Руководитель</dt><dd>Директор Большаков Роман Родионович, действует на основании устава</dd></div>
      <div><dt>Адрес</dt><dd>220037, г. Минск, пер. Твёрдый 1-й, д. 11, пом. 2, каб. 5</dd></div>
      <div><dt>Расчётный счёт</dt><dd class="num">BY56PJCB30120559261000000933 в ЦБУ № 100 ОАО «Приорбанк», г. Минск, ул. Радиальная, 38-А</dd></div>
      <div><dt>Код банка · УНП</dt><dd class="num">PJCBBY2X · 193087869</dd></div>
      <div><dt>Связь</dt><dd><span class="num">+375 29 187-75-65</span>, Vagmotorsby@gmail.com</dd></div>
    </dl></details>
  </div>
</section>

<section class="contact" id="contacts" aria-labelledby="book-title">
  <div class="photo-strip" aria-hidden="true"><div class="photo-strip__track">{pstrip}</div></div>
  <div class="contact__in">
    <h2 id="book-title">Запись на СТО</h2>
    <form class="booking" id="book" data-booking novalidate aria-labelledby="book-title">
      <fieldset>
        <legend>Марка</legend>
        <div class="chips" role="radiogroup">
          {''.join(f'<label class="chip-radio"><input type="radio" name="make" value="{n}" data-make-id="{i}"><span>{n}</span></label>' for i,n,_ in makes)}
        </div>
      </fieldset>
      <div class="booking__bar">
        <div class="cell"><label for="b-model">Модель, год, двигатель</label><input id="b-model" name="model" type="text" autocomplete="off" placeholder="Passat B8 2016, 2.0 TDI"></div>
        <div class="cell"><label for="b-task">Что нужно сделать</label><input id="b-task" name="task" type="text" list="b-tasks" autocomplete="off" placeholder="Рывки DSG, ТО, стук…">
          <datalist id="b-tasks"><option value="Компьютерная диагностика"><option value="Плановое ТО"><option value="Диагностика и ремонт DSG"><option value="Ремонт подвески"><option value="Ремонт тормозов"><option value="Ремонт двигателя"><option value="Электрика"><option value="Кондиционер и отопитель"><option value="Диагностика перед покупкой"></datalist></div>
        <fieldset class="cell cell--ch"><legend class="sr-only">Куда отправить</legend><span class="small" style="font-weight:600;color:var(--concrete-muted)">Куда отправить</span>
          <div class="chs"><label class="chip-radio"><input type="radio" name="channel" value="telegram" checked><span>Telegram</span></label><label class="chip-radio"><input type="radio" name="channel" value="viber"><span>Viber</span></label><label class="chip-radio"><input type="radio" name="channel" value="whatsapp"><span>WhatsApp</span></label></div>
        </fieldset>
        <button class="booking__submit" type="submit">Записаться</button>
      </div>
      <p class="booking__status" data-booking-status role="status" aria-live="polite">Заявка откроется в мессенджере с готовым текстом. Или позвоните: <a class="num" href="tel:+375296200421">+375 29 620-04-21</a></p>
    </form>
    <div class="contact__lines">
      <div><span class="small">Сервис</span><a class="big num" href="tel:+375296200421">+375 29 620-04-21</a><a href="https://t.me/%2B375296200421" target="_blank" rel="noopener">Telegram</a> · <a href="viber://chat?number=%2B375296200421">Viber</a> · <a href="https://wa.me/375296200421" target="_blank" rel="noopener">WhatsApp</a></div>
      <div><span class="small">Запчасти</span><a class="big num" href="tel:+375296200427">+375 29 620-04-27</a><a href="viber://chat?number=%2B375296200427">Viber</a> · <a href="mailto:info@vagmotors.by">info@vagmotors.by</a></div>
      <div data-open-sign data-open="9" data-close="21"><span class="small">Адрес</span><span class="big" style="font-size:clamp(20px,1.6vw,26px)">1-й Твёрдый пер., 11, корп. 3</span><span class="lamp"><i aria-hidden="true"></i><span data-open-text>Ежедневно 9:00–21:00</span></span></div>
    </div>
    <div class="mapline"><iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A8595801120e96e03aa72430106bf861dee2073469a258e121d6f2357499895c9&amp;source=constructor" title="VAGMOTORS на карте: Минск, 1-й Твёрдый переулок, 11" loading="lazy"></iframe></div>
  </div>
</section>

</main>
''' + footer(True) + dock(True) + '<script src="../assets/js/main.js" defer></script>\n</body>\n</html>\n'
open('v3/index.html', 'w', encoding='utf-8').write(idx)

# ───────── price ─────────
import re
p = open('price.html', encoding='utf-8').read()
a = p.index('<section class="pl" data-pricelist>'); b = p.rindex('</section>', a, p.index('</main>')) + len('</section>')
pl = p[a:b]
pl = pl.replace('class="wrap"', 'class="pl__in"')
pr = head('Цены на ремонт Volkswagen, Audi, Škoda в Минске — VAGMOTORS',
          'Стоимость работ VAGMOTORS по маркам Volkswagen, Audi и Škoda: цены от минимальных. Добавляйте работы в заказ и отправляйте расчёт мастеру.',
          'https://dirol982.github.io/vagmotors/v3/price.html') + bar(False) + f'''<main id="main">
<section class="board ph" aria-labelledby="ph-title">
  <div class="tile t-concrete ph__title">
    <nav class="crumbs" aria-label="Навигационная цепочка"><a href="./">Главная</a> / <span aria-current="page">Цены</span></nav>
    <h1 id="ph-title">Стоимость работ</h1>
  </div>
  <div class="tile t-dark ph__ask">
    <p>Цена одной и той же услуги зависит от модели, двигателя, КПП и систем автомобиля, поэтому здесь указан минимум. Отметьте работы — внизу посчитается подытог, — и отправьте заказ мастеру.</p>
    <a class="btn" href="viber://chat?number=%2B375296200421">Узнать точную цену в Viber</a>
  </div>
</section>
{pl}
</main>
''' + footer(False) + dock(False) + '<script src="../assets/js/main.js" defer></script>\n</body>\n</html>\n'
open('v3/price.html', 'w', encoding='utf-8').write(pr)
print('v3 written', len(idx), len(pr))
