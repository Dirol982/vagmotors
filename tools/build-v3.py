# Собирает v3 («моторспорт-брутализм», скилл premium-auto-site): v3/index.html и v3/price.html.
# Данные (калькулятор, отзывы, прайс) берутся из основной версии: index.html и price.html.
# Запуск из корня репозитория: python3 tools/build-v3.py
import html
import re

e = html.escape
main = open('index.html', encoding='utf-8').read()
price_src = open('price.html', encoding='utf-8').read()

calc_json = re.search(r'<script type="application/json" data-calc-data>(.*?)</script>', main, re.S).group(1).strip()
reviews = [
    dict(text=re.sub(r'\s+', ' ', t).strip(), name=n.strip(), meta=re.sub(r'\s+', ' ', m).strip())
    for t, n, m in re.findall(
        r'<figure class="quote[^"]*" data-quote[^>]*>\s*<blockquote>\s*<p>(.*?)</p>\s*</blockquote>\s*<figcaption>\s*<strong>(.*?)</strong>\s*<span class="muted">(.*?)</span>',
        main, re.S)
]
a = price_src.index('<section class="pl" data-pricelist>')
b = price_src.rindex('</section>', a, price_src.index('</main>')) + len('</section>')
pricelist = price_src[a:b]

IMG = '../assets/img/'
TEL = '+375296200421'
TEL_L = '+375 29 620-04-21'
SEARCH = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4"/></svg>'
PHONE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.2 3.5h3l1.6 4.2-2 1.4a11 11 0 0 0 7.1 7.1l1.4-2 4.2 1.6v3a1.7 1.7 0 0 1-1.8 1.7C10.6 20 4 13.4 3.5 5.3a1.7 1.7 0 0 1 1.7-1.8Z"/></svg>'


def head(title, desc, url):
    return f'''<!doctype html>
<html lang="ru" data-currency="BYN">
<head>
<script>try{{var t=localStorage.getItem("vag-theme");if(t)document.documentElement.dataset.theme=t}}catch(e){{}}</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="format-detection" content="telephone=no">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="theme-color" content="#0a0a0a">
<meta name="author" content="Diroll25">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<link rel="icon" type="image/png" href="../favicon.png">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@300;500;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="alternate" hreflang="ru" href="{url}">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<a class="skip" href="#main">К содержанию</a>
'''


def header(home=True):
    h = (lambda x: x) if home else (lambda x: 'index.html' + x)
    return f'''<header class="top" data-header>
  <div class="top__in">
    <a class="brand" href="./" aria-label="VAG MOTORS — на главную"><img class="logo-on-dark" src="{IMG}logo-light.webp" alt="VAG MOTORS" width="320" height="130"><img class="logo-on-light" src="{IMG}logo-dark.webp" alt="" width="320" height="130"></a>
    <nav class="nav" aria-label="Разделы">
      <a href="{h('#calc')}">Стоимость</a>
      <a href="{h('#services')}">Услуги</a>
      <a href="price.html">Прайс</a>
      <a href="{h('#workshop')}">Цех</a>
      <a href="{h('#reviews')}">Отзывы</a>
      <a href="{h('#contacts')}">Контакты</a>
    </nav>
    <span class="status" data-status><i></i><span data-status-text>Ежедневно 9:00–21:00</span></span>
    <div class="tools">
      <a class="tool tool--lang" href="{'en/' if home else 'en/price.html'}" hreflang="en" lang="en" aria-label="English version">EN</a>
      <button class="tool tool--theme" type="button" data-theme-toggle aria-label="Светлая тема"><svg class="i-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg><svg class="i-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg></button>
    </div>
    <a class="btn btn--sm" href="{h('#book')}">Записаться</a>
  </div>
</header>
'''


def footer():
    return f'''<footer class="foot">
  <div class="wrap foot__in">
    <img class="logo-on-dark" src="{IMG}logo-light.webp" alt="VAG MOTORS" width="110" height="45" loading="lazy"><img class="logo-on-light" src="{IMG}logo-dark.webp" alt="VAG MOTORS" width="110" height="45" loading="lazy">
    <p class="partners"><span class="label">Марки</span> Volkswagen · Audi · Škoda · SEAT · Porsche · Bentley</p>
    <p class="tiny muted">© ООО «ВАГМОТОРС», УНП 193087869. Независимый сервис, марки принадлежат владельцам.<br>Дизайн и разработка — Diroll25</p>
  </div>
</footer>
'''


def dock(home=True):
    if home:
        return f'''<nav class="dock" aria-label="Быстрая связь">
  <button type="button" class="dock__sum" data-check-open aria-controls="precheck"><small>Ваш расчёт</small><b class="num"><span data-dock-empty>пока пусто</span><span data-dock-full hidden>от <span data-dock-sum>0</span> BYN</span></b></button>
  <a class="dock__call" href="tel:{TEL}" aria-label="Позвонить: {TEL_L}">{PHONE}</a>
  <button type="button" class="dock__book" data-check-open aria-controls="precheck">Предчек</button>
</nav>
'''
    return f'''<nav class="dock dock--price" aria-label="Быстрая связь">
  <a class="dock__call" href="tel:{TEL}">Позвонить</a>
  <a class="dock__book" href="index.html#book">Записаться</a>
</nav>
'''


def li(name, price):
    return f'<tr><th scope="row">{e(name)}</th><td>от {price}</td></tr>'


SVC = {
    'dsg': [('Диагностика и ремонт DSG', 50), ('Замена масла в DSG', 80), ('Замена маховика', 680), ('Замена сцепления DSG', 920)],
    'to': [('ТО по регламенту', 40), ('Замена масла в двигателе', 30), ('Замена воздушного и салонного фильтра', 40), ('Замена тормозной жидкости', 80)],
    'engine': [('Ремонт турбины', 200), ('Замена ремня ГРМ', 560), ('Замена цепи ГРМ', 920), ('Устранение масложора', 1200)],
    'chassis': [('Диагностика подвески', 20), ('Замена амортизаторов', 60), ('Замена тормозных колодок', 70), ('Ремонт пневмоподвески', 200)],
    'diag': [('Диагностика подвески', 20), ('Компьютерная диагностика', 50), ('Заправка кондиционера', 55), ('Диагностика перед покупкой', 80)],
}
table = lambda k: '<table class="list"><tbody>' + ''.join(li(n, p) for n, p in SVC[k]) + '</tbody></table>'

GALLERY = [
    ('audi-a3-hall', 'Цех на Твёрдом'), ('vas-6150d', 'VAS 6150D'), ('golf-gti-lift', 'Golf GTI'),
    ('camshafts', 'Распредвалы и ГРМ'), ('porsche-macan', 'Porsche Macan'), ('vw-oil-service', 'Оригинальное масло'),
    ('skoda-diagnostics', 'Диагностика Škoda'), ('cayenne-lift', 'Porsche Cayenne'), ('vw-engine-bay', 'Моторный отсек'),
    ('audi-s6-lift', 'Audi S6'), ('vw-oil-shelf', 'Склад запчастей'),
]
strip = ''.join(
    f'<figure><img src="{IMG}{n}-720.webp" srcset="{IMG}{n}-720.webp 720w, {IMG}{n}.webp 1440w" sizes="330px" alt="{e(c)} — VAG MOTORS" width="720" height="960" loading="lazy" decoding="async"><figcaption>{e(c)}</figcaption></figure>'
    for n, c in GALLERY)

rv = ''
for i, r in enumerate(reviews):
    cls = 'rv rv--accent' if i == 0 else 'rv'
    rv += f'<blockquote class="{cls}"><p>{r["text"]}</p><footer><b>{e(r["name"])}</b><span>{e(r["meta"])}</span></footer></blockquote>'

MAKES = [('vw', 'Volkswagen'), ('audi', 'Audi'), ('skoda', 'Škoda'), ('porsche', 'Porsche'), ('seat', 'SEAT'), ('bentley', 'Bentley')]

index = head('VAG MOTORS — автосервис Volkswagen, Audi, Škoda, SEAT, Porsche в центре Минска',
             'Специализированный сервис концерна VAG в центре Минска: DSG, двигатель, ТО, диагностика дилерским ПО. Цена до визита, гарантия до 12 месяцев. Ежедневно 9:00–21:00.',
             'https://dirol982.github.io/vagmotors/v3/') + header(True) + f'''
<main id="main">

<section class="hero">
  <div class="wrap">
    <p class="coord mono">VAG service <b>/</b> Минск, 1-й Твёрдый пер., 11 <b>/</b> 53.9087° N, 27.6015° E</p>
    <h1 class="mega" aria-label="Автосервис концерна VAG: Volkswagen, Audi, Škoda, SEAT, Porsche, Bentley">
      <span class="mega__l1">Автосервис</span>
      <span class="mega__l2"><span>концерна <b>VAG</b></span><span class="mega__dash" aria-hidden="true"></span></span>
    </h1>

    <div class="bento bento--hero">
      <figure class="tile tile--photo tile--hero">
        <img src="{IMG}audi-a3-hall.webp" srcset="{IMG}audi-a3-hall-720.webp 720w, {IMG}audi-a3-hall.webp 1440w" sizes="(max-width: 1000px) 100vw, 50vw" alt="Audi A3 и Golf на подъёмниках в цеху VAG MOTORS" width="1440" height="1920" fetchpriority="high">
        <figcaption class="mono">Volkswagen · Audi · Škoda · SEAT · Porsche · Bentley. От лампочки до капремонта.</figcaption>
      </figure>

      <div class="tile tile--season">
        <p class="label" data-season-label>Сезон</p>
        <p class="tile__big" data-season-title>Подготовка к зиме</p>
        <p class="muted" data-season-text>Антифриз, аккумулятор, свечи накала, компьютерная диагностика.</p>
      </div>

      <div class="tile tile--spec">
        <p class="label">Гарантия до</p>
        <p class="tile__huge">12<span>&nbsp;мес</span></p>
        <p class="muted">или 20 000 км на ремонт с оригинальными запчастями</p>
      </div>

      <div class="tile tile--open">
        <p class="label">Сейчас</p>
        <p class="tile__big" data-open-title>9:00–21:00</p>
        <p class="muted">Без выходных · <a href="tel:{TEL}">{TEL_L}</a></p>
      </div>

      <a class="tile tile--cta" href="#calc">
        <span class="label">Заказ-наряд онлайн</span>
        <span class="tile__cta">Цена до визита <span aria-hidden="true">↗</span></span>
      </a>
    </div>
  </div>
</section>

<section class="sec" id="about">
  <div class="wrap">
    <div class="sec__head">
      <p class="label">01 / Подход</p>
      <h2 class="h2">Только VAG</h2>
    </div>
    <ul class="bento bento--three">
      <li class="tile">
        <p class="tile__k mono">Марки</p>
        <h3 class="h3">Один концерн</h3>
        <p class="muted">Volkswagen, Audi, Škoda, SEAT, Porsche, Bentley. Знаем слабые места каждой модификации.</p>
      </li>
      <li class="tile">
        <p class="tile__k mono">Диагностика</p>
        <h3 class="h3">Дилерское ПО</h3>
        <p class="muted">VAS 6150D и технология завода-производителя.</p>
      </li>
      <li class="tile">
        <p class="tile__k mono">Процесс</p>
        <h3 class="h3">Всё согласуем</h3>
        <p class="muted">Держим в курсе ремонта. Можно наблюдать за работой.</p>
      </li>
    </ul>
  </div>
</section>

<section class="sec sec--panel" id="calc" data-calc>
  <script type="application/json" data-calc-data>{calc_json}</script>
  <div class="wrap">
    <div class="sec__head">
      <p class="label">02 / Стоимость</p>
      <h2 class="h2">Цена до визита</h2>
      <p class="muted lede">Отметьте работы или нажмите на то, что беспокоит. Цены «от», без запчастей. Точную назовём по VIN.</p>
    </div>

    <div class="calc">
      <div class="calc__panel">
        <div class="calc__top">
          <div class="cseg" role="radiogroup" aria-label="Марка">
            <label class="cseg__item"><input type="radio" name="calc-make" value="vw" checked><span>Volkswagen</span></label>
            <label class="cseg__item"><input type="radio" name="calc-make" value="audi"><span>Audi</span></label>
            <label class="cseg__item"><input type="radio" name="calc-make" value="skoda"><span>Škoda</span></label>
          </div>
          <small class="calc__hint">Porsche, SEAT, Bentley — по запросу</small>
        </div>
        <label class="calc__search">{SEARCH}<span class="sr">Поиск работы</span><input type="search" placeholder="Колодки, ГРМ, сцепление DSG…" autocomplete="off" data-calc-search><span class="calc__found" data-calc-found aria-live="polite"></span></label>
        <div class="calc__sym"><span class="calc__sym-l">Что беспокоит?</span><div class="calc__sym-row" data-calc-sym></div></div>
        <div class="calc__cats" role="tablist" aria-label="Раздел прайса" data-calc-cats></div>
        <div class="calc__items" data-calc-items></div>
        <div class="calc__foot" data-calc-foot></div>
        <p class="sr">Работ в прайсе: <span data-calc-count>89</span></p>
      </div>

      <div class="calc__backdrop" data-check-backdrop hidden></div>
      <form class="check" id="precheck" aria-labelledby="check-title" data-check novalidate>
        <div class="check__top">
          <h3 id="check-title">Заказ-наряд</h3>
          <button type="button" class="check__clear" data-check-clear hidden>Очистить</button>
          <button type="button" class="check__close" data-check-close aria-label="Свернуть расчёт"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg></button>
        </div>
        <p class="check__meta" data-check-meta>VAGMOTORS · Volkswagen · работ: 0</p>
        <ul class="check__lines" role="list" data-check-lines></ul>
        <div class="check__total"><span>Итого</span><strong class="num"><span data-check-sum>0</span> <small>BYN</small></strong></div>
        <p class="check__fine">От минимальной цены, без запчастей. Согласуем до начала работ.</p>
        <div class="check__book" data-check-book hidden>
          <label class="check__label" for="check-model">Модель, год, двигатель</label>
          <input id="check-model" class="check__input" name="model" type="text" placeholder="Golf 7 2016, 1.4 TSI" autocomplete="off">
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
        <div class="check__row"><button type="button" class="check__copy" data-check-copy>Скопировать</button><a href="tel:{TEL}">{TEL_L}</a></div>
      </form>
    </div>
    <div class="toast" data-toast role="status" aria-live="polite"></div>
  </div>
</section>

<section class="sec" id="visit">
  <div class="wrap visit">
    <figure class="visit__fig">
      <img src="{IMG}vw-oil-service.webp" srcset="{IMG}vw-oil-service-720.webp 720w, {IMG}vw-oil-service.webp 1440w" sizes="(max-width: 860px) 100vw, 50vw" alt="Мастер VAG MOTORS заливает оригинальное масло Volkswagen" width="1440" height="1920" loading="lazy">
    </figure>
    <div class="visit__body">
      <p class="label">03 / Порядок</p>
      <h2 class="h2">Визит</h2>
      <ol class="steps">
        <li><h3>Запись</h3><p>Расчёт на сайте или звонок. Ответим в мессенджере.</p></li>
        <li><h3>Заезд</h3><p>1-й Твёрдый пер., 11. Ежедневно 9:00–21:00.</p></li>
        <li><h3>Работа</h3><p>Согласуем каждое действие. Можно наблюдать.</p></li>
        <li><h3>Выдача</h3><p>Гарантия до 12 месяцев. Наличный и безналичный расчёт.</p></li>
      </ol>
    </div>
  </div>
</section>

<section class="sec sec--panel" id="services">
  <div class="wrap">
    <div class="sec__head sec__head--row">
      <div>
        <p class="label">04 / Услуги</p>
        <h2 class="h2">Услуги</h2>
      </div>
      <a class="btn btn--ghost" href="price.html">Весь прайс и заказ ↗</a>
    </div>

    <div class="bento bento--svc">
      <article class="tile tile--storage tile--dsg" id="dsg">
        <div class="tile__bg" role="img" aria-label="Audi S6 в цеху VAG MOTORS" style="background-image:url('{IMG}audi-s6-lift.webp')"></div>
        <div class="tile__inner">
          <p class="label">DQ200 · DQ250 · DQ500 · DL501 · DL382</p>
          <h3 class="h3 h3--lg">Ремонт DSG и S tronic</h3>
          <p class="muted">Мехатроник, сцепление, маховик. Дилерское ПО, LUK и Sachs.</p>
          {table('dsg')}
          <a class="btn" href="#calc" data-pick-task="Диагностика и ремонт DSG">Рассчитать DSG ↗</a>
        </div>
      </article>

      <article class="tile">
        <p class="label">По регламенту завода</p>
        <h3 class="h3">ТО</h3>
        {table('to')}
      </article>

      <article class="tile">
        <p class="label">Турбина · ГРМ · масложор</p>
        <h3 class="h3">Двигатель</h3>
        {table('engine')}
      </article>

      <article class="tile">
        <p class="label">Включая пневмоподвеску</p>
        <h3 class="h3">Ходовая и тормоза</h3>
        {table('chassis')}
      </article>

      <article class="tile">
        <p class="label">VAS 6150D · кондиционер</p>
        <h3 class="h3">Диагностика</h3>
        {table('diag')}
      </article>

      <a class="tile yt" href="https://www.youtube.com/watch?v=qMt1-gWE-QI" target="_blank" rel="noopener" data-yt="qMt1-gWE-QI" data-yt-title="СТО VAG Motors — ремонт Volkswagen, Audi, Skoda, Porsche и Seat" aria-label="Смотреть видео «СТО VAG Motors — ремонт Volkswagen, Audi, Skoda, Porsche и Seat»">
        <img src="{IMG}golf-gti-lift.webp" srcset="{IMG}golf-gti-lift-720.webp 720w, {IMG}golf-gti-lift.webp 1440w" sizes="100vw" alt="" width="1440" height="1920" loading="lazy">
        <span class="yt__cap"><span class="yt__play" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></span><span class="yt__t"><span class="label">YouTube · VAG Motors</span><b>Сервис изнутри</b></span></span>
      </a>
    </div>
  </div>
</section>

<section class="sec" id="workshop" data-swipe>
  <div class="wrap">
    <div class="sec__head sec__head--row">
      <div>
        <p class="label">05 / Цех</p>
        <h2 class="h2">Цех</h2>
      </div>
      <div class="rv-nav">
        <button class="rv-btn" type="button" data-swipe-prev aria-label="Предыдущие фото">←</button>
        <button class="rv-btn" type="button" data-swipe-next aria-label="Следующие фото">→</button>
      </div>
    </div>
  </div>
  <div class="strip" data-swipe-track tabindex="0" role="region" aria-label="Фото цеха: листайте пальцем, мышью или стрелками">{strip}</div>
  <div class="strip-bar" data-swipe-bar aria-hidden="true"><div class="strip-track"><span></span></div></div>
</section>

<section class="sec sec--panel" id="reviews">
  <div class="wrap">
    <div class="sec__head sec__head--row">
      <div>
        <p class="label">06 / Отзывы</p>
        <h2 class="h2">Отзывы</h2>
      </div>
      <div class="rv-nav">
        <button class="rv-btn" type="button" data-rv="-1" aria-label="Предыдущие отзывы">←</button>
        <button class="rv-btn" type="button" data-rv="1" aria-label="Следующие отзывы">→</button>
      </div>
    </div>
  </div>
  <div class="reviews" id="reviewsTrack" tabindex="0" aria-label="Отзывы клиентов">
    {rv}
    <a class="rv rv--more" href="https://yandex.by/maps/org/vag_motors/10551282929/reviews/?ll=27.601528%2C53.908665&amp;z=16" target="_blank" rel="noopener">
      <span class="label">Яндекс Карты · Google · ВКонтакте</span>
      <span class="rv__more">Все отзывы <span aria-hidden="true">↗</span></span>
    </a>
  </div>
</section>

<section class="book" id="book">
  <div class="wrap">
    <div class="book__head"><span class="label">В мессенджер · готовый текст заявки</span><span class="book__arrow" aria-hidden="true">↗</span></div>
    <h2 class="book__word" id="book-title">Записаться</h2>
    <form class="booking" data-booking novalidate aria-labelledby="book-title" style="margin-top:clamp(18px,3vw,32px)">
      <fieldset>
        <legend class="label">Марка</legend>
        <div class="makes-seg" role="radiogroup">
          {''.join(f'<label><input type="radio" name="make" value="{n}" data-make-id="{i}"><span>{n}</span></label>' for i, n in MAKES)}
        </div>
      </fieldset>
      <div class="booking__row">
        <div class="fld"><label class="label" for="b-model">Модель, год, двигатель</label><input id="b-model" name="model" type="text" autocomplete="off" placeholder="Passat B8 2016, 2.0 TDI"></div>
        <div class="fld"><label class="label" for="b-task">Что нужно сделать</label><input id="b-task" name="task" type="text" list="b-tasks" autocomplete="off" placeholder="Рывки DSG, ТО, стук…">
          <datalist id="b-tasks"><option value="Компьютерная диагностика"><option value="Плановое ТО"><option value="Диагностика и ремонт DSG"><option value="Ремонт подвески"><option value="Ремонт тормозов"><option value="Ремонт двигателя"><option value="Электрика"><option value="Кондиционер и отопитель"><option value="Диагностика перед покупкой"></datalist></div>
        <fieldset class="seg"><legend class="label">Куда</legend>
          <label><input type="radio" name="channel" value="telegram" checked><span>Telegram</span></label>
          <label><input type="radio" name="channel" value="viber"><span>Viber</span></label>
          <label><input type="radio" name="channel" value="whatsapp"><span>WhatsApp</span></label>
        </fieldset>
        <button class="btn" type="submit">Отправить ↗</button>
      </div>
      <p class="booking__status" data-booking-status role="status" aria-live="polite">Заявка откроется в мессенджере с готовым текстом.</p>
    </form>
    <div class="book__row">
      <p class="muted">Или позвоните</p>
      <a class="book__tel" href="tel:{TEL}">{TEL_L}</a>
    </div>
  </div>
</section>

<section class="sec" id="contacts">
  <div class="wrap contacts">
    <div class="contacts__info">
      <p class="label">07 / Контакты</p>
      <h2 class="h2">1-й Твёрдый пер., 11</h2>
      <dl class="cinfo">
        <div><dt>Адрес</dt><dd>Минск, 1-й Твёрдый переулок, 11, корпус 3<br><span class="muted">центр города</span></dd></div>
        <div><dt>Часы</dt><dd>Ежедневно 9:00–21:00</dd></div>
        <div><dt>Сервис</dt><dd><a href="tel:{TEL}">{TEL_L}</a><br><span class="muted"><a href="https://t.me/%2B375296200421" target="_blank" rel="noopener">Telegram</a> · <a href="viber://chat?number=%2B375296200421">Viber</a> · <a href="https://wa.me/375296200421" target="_blank" rel="noopener">WhatsApp</a></span></dd></div>
        <div><dt>Запчасти</dt><dd><a href="tel:+375296200427">+375 29 620-04-27</a> <span class="muted">· Viber</span></dd></div>
        <div><dt>Почта</dt><dd><a href="mailto:info@vagmotors.by">info@vagmotors.by</a></dd></div>
        <div><dt>Навигатор</dt><dd><span class="mono">53.908665, 27.601528</span> <button class="copy" type="button" data-copy="53.908665, 27.601528">Скопировать</button></dd></div>
        <div id="business"><dt>Юрлицам</dt><dd>Наличный и безналичный расчёт, НДС, автопарки</dd></div>
      </dl>
      <div class="contacts__links">
        <a class="btn btn--ghost" href="https://yandex.by/maps/org/vag_motors/10551282929/?ll=27.601528%2C53.908665&amp;z=16" target="_blank" rel="noopener">Яндекс Карты</a>
        <a class="btn btn--ghost" href="https://www.google.com/maps/search/?api=1&amp;query=53.908665,27.601528" target="_blank" rel="noopener">Google Maps</a>
        <a class="btn btn--ghost" href="https://www.instagram.com/vagmotorsby/" target="_blank" rel="noopener">Instagram</a>
        <a class="btn btn--ghost" href="https://www.youtube.com/@VAG-Motors" target="_blank" rel="noopener">YouTube</a>
      </div>
      <details class="req"><summary>Реквизиты</summary><dl>
        <div><dt>Организация</dt><dd>ООО «ВАГМОТОРС», директор Большаков Роман Родионович</dd></div>
        <div><dt>Адрес</dt><dd>220037, г. Минск, пер. Твёрдый 1-й, д. 11, пом. 2, каб. 5</dd></div>
        <div><dt>Счёт</dt><dd class="mono">BY56PJCB30120559261000000933, ЦБУ № 100 ОАО «Приорбанк», BIC PJCBBY2X</dd></div>
        <div><dt>УНП</dt><dd class="mono">193087869</dd></div>
        <div><dt>Связь</dt><dd>+375 29 187-75-65, Vagmotorsby@gmail.com</dd></div>
      </dl></details>
    </div>
    <div class="map">
      <iframe title="VAG MOTORS на карте: Минск, 1-й Твёрдый переулок, 11" src="https://yandex.by/map-widget/v1/?ll=27.601528%2C53.908665&amp;z=16&amp;pt=27.601528%2C53.908665%2Cpm2rdl&amp;l=map" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</section>

</main>
''' + footer() + dock(True) + '''<script src="../assets/js/main.js" defer></script>
<script src="assets/js/tw.js" defer></script>
</body>
</html>
'''
open('v3/index.html', 'w', encoding='utf-8').write(index)

pl = pricelist.replace('руб.', 'BYN')
price = head('Прайс VAG MOTORS — Volkswagen, Audi, Škoda в Минске',
             'Стоимость работ VAG MOTORS по маркам Volkswagen, Audi и Škoda. Цены от минимальных: отметьте работы и оформите заказ.',
             'https://dirol982.github.io/vagmotors/v3/price.html') + header(False) + f'''
<main id="main">
<section class="ph">
  <div class="wrap">
    <p class="coord mono">Прайс <b>/</b> Volkswagen · Audi · Škoda <b>/</b> цены от, BYN</p>
    <h1 class="mega"><span class="mega__l1">Стоимость</span><span class="mega__l2"><span>работ</span><span class="mega__dash" aria-hidden="true"></span></span></h1>
    <div class="ph__row">
      <p class="muted lede">Цена зависит от модели, двигателя и КПП. Отметьте работы — подытог внизу, — и оформите заказ.</p>
      <a class="btn btn--ghost" href="viber://chat?number=%2B375296200421">Точная цена в Viber ↗</a>
    </div>
  </div>
</section>
{pl}
</main>
''' + footer() + dock(False) + '''<script src="../assets/js/main.js" defer></script>
<script src="assets/js/tw.js" defer></script>
</body>
</html>
'''
open('v3/price.html', 'w', encoding='utf-8').write(price)
print('v3:', len(index), len(price), 'reviews', len(reviews))


# ════════ English pages: v3/en/ ════════
import json

WORKS = json.load(open('tools/works-en.json', encoding='utf-8'))
PAGE_EN = {
    'VAG MOTORS — автосервис Volkswagen, Audi, Škoda, SEAT, Porsche в центре Минска': 'VAG MOTORS — Volkswagen, Audi, Škoda, SEAT, Porsche service in central Minsk',
    'Специализированный сервис концерна VAG в центре Минска: DSG, двигатель, ТО, диагностика дилерским ПО. Цена до визита, гарантия до 12 месяцев. Ежедневно 9:00–21:00.': 'Specialist VAG group service in central Minsk: DSG, engines, scheduled maintenance, dealer-software diagnostics. Price before you visit, up to 12 months warranty. Daily 9:00–21:00.',
    'Прайс VAG MOTORS — Volkswagen, Audi, Škoda в Минске': 'VAG MOTORS price list — Volkswagen, Audi, Škoda in Minsk',
    'Стоимость работ VAG MOTORS по маркам Volkswagen, Audi и Škoda. Цены от минимальных: отметьте работы и оформите заказ.': 'VAG MOTORS labour prices for Volkswagen, Audi and Škoda. Prices from: tick the jobs and check out.',
    'К содержанию': 'Skip to content', 'Стоимость': 'Price', 'Услуги': 'Services', 'Прайс': 'Price list', 'Цех': 'Workshop',
    'Отзывы': 'Reviews', 'Контакты': 'Contacts', 'Ежедневно 9:00–21:00': 'Daily 9:00–21:00', 'Записаться': 'Book',
    'Минск, 1-й Твёрдый пер., 11': 'Minsk, 1st Tvyordy Lane, 11', 'Автосервис': 'Workshop',
    'Volkswagen · Audi · Škoda · SEAT · Porsche · Bentley. От лампочки до капремонта.': 'Volkswagen · Audi · Škoda · SEAT · Porsche · Bentley. From a bulb to an engine rebuild.',
    'Сезон': 'Season', 'Подготовка к зиме': 'Winter prep', 'Антифриз, аккумулятор, свечи накала, компьютерная диагностика.': 'Coolant, battery, glow plugs, computer diagnostics.',
    'Гарантия до': 'Warranty up to', 'или 20 000 км на ремонт с оригинальными запчастями': 'or 20,000 km on repairs with genuine parts',
    'Сейчас': 'Now', 'Без выходных ·': 'Open every day ·', 'Заказ-наряд онлайн': 'Online work order', 'Цена до визита': 'Price before you visit',
    '01 / Подход': '01 / Approach', 'Только VAG': 'VAG only', 'Марки': 'Makes', 'Один концерн': 'One group',
    'Volkswagen, Audi, Škoda, SEAT, Porsche, Bentley. Знаем слабые места каждой модификации.': 'Volkswagen, Audi, Škoda, SEAT, Porsche, Bentley. We know the weak spots of every variant.',
    'Диагностика': 'Diagnostics', 'Дилерское ПО': 'Dealer software', 'VAS 6150D и технология завода-производителя.': 'VAS 6150D and factory procedures.',
    'Процесс': 'Process', 'Всё согласуем': 'Nothing without your OK', 'Держим в курсе ремонта. Можно наблюдать за работой.': 'We keep you posted. You can watch the work.',
    '02 / Стоимость': '02 / Price',
    'Отметьте работы или нажмите на то, что беспокоит. Цены «от», без запчастей. Точную назовём по VIN.': 'Tick the jobs or tap what is wrong. Prices are “from”, parts not included. We confirm the exact price by VIN.',
    'Porsche, SEAT, Bentley — по запросу': 'Porsche, SEAT, Bentley — on request', 'Поиск работы': 'Search jobs', 'Что беспокоит?': "What's wrong?",
    'Работ в прайсе:': 'Jobs in the list:', 'Заказ-наряд': 'Work order', 'Очистить': 'Clear', 'VAGMOTORS · Volkswagen · работ: 0': 'VAGMOTORS · Volkswagen · jobs: 0',
    'Итого': 'Total', 'От минимальной цены, без запчастей. Согласуем до начала работ.': 'From the minimum price, parts not included. Agreed before any work starts.',
    'Модель, год, двигатель': 'Model, year, engine', 'Когда удобно': 'Preferred time', 'Куда отправить': 'Send via',
    'Записаться с этим расчётом': 'Book with this estimate', 'Скопировать': 'Copy',
    '03 / Порядок': '03 / How it works', 'Визит': 'Visit', 'Запись': 'Booking', 'Расчёт на сайте или звонок. Ответим в мессенджере.': 'An estimate on the site or a call. We reply in your messenger.',
    'Заезд': 'Drop-off', '1-й Твёрдый пер., 11. Ежедневно 9:00–21:00.': '1st Tvyordy Lane, 11. Daily 9:00–21:00.', 'Работа': 'Work',
    'Согласуем каждое действие. Можно наблюдать.': 'Every step agreed with you. You can watch.', 'Выдача': 'Pick-up',
    'Гарантия до 12 месяцев. Наличный и безналичный расчёт.': 'Up to 12 months warranty. Cash or bank transfer.',
    '04 / Услуги': '04 / Services', 'Весь прайс и заказ ↗': 'Full price list and order ↗', 'Ремонт DSG и S tronic': 'DSG and S tronic repair',
    'Мехатроник, сцепление, маховик. Дилерское ПО, LUK и Sachs.': 'Mechatronics, clutch, flywheel. Dealer software, LUK and Sachs.',
    'Диагностика и ремонт DSG': 'DSG diagnostics and repair', 'Замена масла в DSG': 'DSG oil change', 'Замена сцепления DSG': 'DSG clutch replacement',
    'Рассчитать DSG ↗': 'Estimate DSG ↗', 'По регламенту завода': 'To the factory schedule', 'ТО': 'Service', 'ТО по регламенту': 'Scheduled service',
    'Замена воздушного и салонного фильтра': 'Air and cabin filter replacement', 'Турбина · ГРМ · масложор': 'Turbo · timing · oil burning',
    'Двигатель': 'Engine', 'Включая пневмоподвеску': 'Air suspension included', 'Ходовая и тормоза': 'Suspension and brakes',
    'VAS 6150D · кондиционер': 'VAS 6150D · A/C', 'Сервис изнутри': 'Inside the workshop', '05 / Цех': '05 / Workshop',
    'Цех на Твёрдом': 'Workshop on Tvyordy', 'Распредвалы и ГРМ': 'Camshafts and timing', 'Оригинальное масло': 'Genuine oil',
    'Диагностика Škoda': 'Škoda diagnostics', 'Моторный отсек': 'Engine bay', 'Склад запчастей': 'Parts store',
    '06 / Отзывы': '06 / Reviews · in Russian', 'Яндекс Карты · Google · ВКонтакте': 'Yandex Maps · Google · VK', 'Все отзывы': 'All reviews',
    'В мессенджер · готовый текст заявки': 'To your messenger · request text ready', 'Марка': 'Make', 'Что нужно сделать': 'What needs doing',
    'Куда': 'Via', 'Отправить ↗': 'Send ↗', 'Заявка откроется в мессенджере с готовым текстом.': 'The request opens in your messenger, ready to send.',
    'Или позвоните': 'Or call', '07 / Контакты': '07 / Contacts', '1-й Твёрдый пер., 11': '1st Tvyordy Lane, 11', 'Адрес': 'Address',
    'Минск, 1-й Твёрдый переулок, 11, корпус 3': 'Minsk, 1st Tvyordy Lane, 11, building 3', 'центр города': 'city centre', 'Часы': 'Hours',
    'Сервис': 'Service', 'Запчасти': 'Parts', 'Почта': 'Email', 'Навигатор': 'GPS', 'Юрлицам': 'Companies',
    'Наличный и безналичный расчёт, НДС, автопарки': 'Cash or bank transfer, VAT invoices, fleets', 'Яндекс Карты': 'Yandex Maps',
    'Реквизиты': 'Company details', 'Организация': 'Company', 'ООО «ВАГМОТОРС», директор Большаков Роман Родионович': 'VAGMOTORS LLC, director Roman Bolshakov',
    '220037, г. Минск, пер. Твёрдый 1-й, д. 11, пом. 2, каб. 5': '220037 Minsk, 1st Tvyordy Lane 11, unit 2, office 5',
    'BY56PJCB30120559261000000933, ЦБУ № 100 ОАО «Приорбанк», BIC PJCBBY2X': 'BY56PJCB30120559261000000933, Priorbank branch No. 100, BIC PJCBBY2X',
    'Счёт': 'Account', 'УНП': 'Tax ID', 'Связь': 'Contact',
    '© ООО «ВАГМОТОРС», УНП 193087869. Независимый сервис, марки принадлежат владельцам.': '© VAGMOTORS LLC, tax ID 193087869. Independent service; makes belong to their owners.',
    'Дизайн и разработка — Diroll25': 'Design and development — Diroll25', 'Ваш расчёт': 'Your estimate', 'пока пусто': 'empty', 'от': 'from',
    'Предчек': 'Estimate', 'VAG MOTORS — на главную': 'VAG MOTORS — home', 'Разделы': 'Sections', 'Светлая тема': 'Light theme',
    'Автосервис концерна VAG: Volkswagen, Audi, Škoda, SEAT, Porsche, Bentley': 'Workshop for VAG group cars: Volkswagen, Audi, Škoda, SEAT, Porsche, Bentley',
    'Audi A3 и Golf на подъёмниках в цеху VAG MOTORS': 'Audi A3 and Golf on lifts in the VAG MOTORS workshop', 'Колодки, ГРМ, сцепление DSG…': 'Pads, timing, DSG clutch…',
    'Раздел прайса': 'Price section', 'Свернуть расчёт': 'Close estimate', 'Мастер VAG MOTORS заливает оригинальное масло Volkswagen': 'A VAG MOTORS technician adding genuine Volkswagen oil',
    'Audi S6 в цеху VAG MOTORS': 'Audi S6 in the VAG MOTORS workshop', 'СТО VAG Motors — ремонт Volkswagen, Audi, Skoda, Porsche и Seat': 'VAG Motors — Volkswagen, Audi, Skoda, Porsche and Seat repair (in Russian)',
    'Смотреть видео «СТО VAG Motors — ремонт Volkswagen, Audi, Skoda, Porsche и Seat»': 'Watch the VAG Motors workshop video (in Russian)',
    'Предыдущие фото': 'Previous photos', 'Следующие фото': 'Next photos', 'Фото цеха: листайте пальцем, мышью или стрелками': 'Workshop photos: swipe, drag or use the arrows',
    'Предыдущие отзывы': 'Previous reviews', 'Следующие отзывы': 'Next reviews', 'Отзывы клиентов': 'Customer reviews', 'Рывки DSG, ТО, стук…': 'Jerky DSG, service, a knock…',
    'Плановое ТО': 'Scheduled service', 'Кондиционер и отопитель': 'A/C and heater', 'VAG MOTORS на карте: Минск, 1-й Твёрдый переулок, 11': 'VAG MOTORS on the map: Minsk, 1st Tvyordy Lane, 11',
    'Быстрая связь': 'Quick contact', 'Позвонить: +375 29 620-04-21': 'Call: +375 29 620-04-21', 'Позвонить': 'Call',
    'цены от, BYN': 'prices from, BYN', 'работ': 'labour', 'Цена зависит от модели, двигателя и КПП. Отметьте работы — подытог внизу, — и оформите заказ.': 'The price depends on the model, engine and gearbox. Tick jobs — the subtotal is below — and check out.',
    'Точная цена в Viber ↗': 'Exact price in Viber ↗', 'Стоимость работ': 'Labour prices', 'Поиск по услугам': 'Search jobs', 'Услуга': 'Job',
    'Цена от, BYN': 'Price from, BYN', 'Ничего не нашли. Напишите нам в': 'Nothing found. Message us on', 'или позвоните': 'or call',
    '— подскажем стоимость.': '— we will quote a price.', 'Стоимость работ по этим маркам назовём индивидуально — напишите модель, год и двигатель.': 'We quote these makes individually — send us the model, year and engine.',
    'Оставить заявку': 'Send a request', 'Найти услугу: сцепление, ГРМ, колодки…': 'Find a job: clutch, timing, pads…',
    'Компьютерная диагностика': 'Computer diagnostics', 'Ремонт подвески': 'Suspension repair', 'Ремонт тормозов': 'Brake repair', 'Ремонт двигателя': 'Engine repair', 'Электрика': 'Electrics',
}
MAKE_RX = r'(Volkswagen|Audi|Škoda)'
BRAND_WORD = re.compile(r'\s*(Ауди|Фольксваген|Шкода)\s*')


def tr(text):
    t = re.sub(r'\s+', ' ', text).strip()
    if not t or not re.search('[А-Яа-яЁё]', t):
        return None
    if t in PAGE_EN:
        return PAGE_EN[t]
    if t in WORKS:
        return WORKS[t]
    m = re.fullmatch(r'от (\d[\d ]*)', t)
    if m:
        return 'from ' + m.group(1)
    m = re.fullmatch(r'(.+), ' + MAKE_RX, t)
    if m and (m.group(1) in WORKS):
        return f'{WORKS[m.group(1)]}, {m.group(2)}'
    m = re.fullmatch(r'Разделы прайса ' + MAKE_RX, t)
    if m:
        return f'{m.group(1)} price sections'
    m = re.fullmatch(r'(.+) — VAG MOTORS', t)
    if m and m.group(1) in PAGE_EN:
        return PAGE_EN[m.group(1)] + ' — VAG MOTORS'
    clean = BRAND_WORD.sub(' ', t).strip()
    if clean in WORKS:
        return WORKS[clean]
    return None


def to_en(doc, ru_url, en_url, other_href):
    doc = doc.replace('<html lang="ru"', '<html lang="en"').replace('content="ru_RU"', 'content="en_GB"')
    doc = doc.replace('<span>концерна <b>VAG</b></span>', '<span>for <b>VAG</b> cars</span>')
    doc = doc.replace('&nbsp;мес</span>', '&nbsp;mo</span>')
    doc = doc.replace('<span class="mega__l1">Стоимость</span><span class="mega__l2"><span>работ</span>', '<span class="mega__l1">Labour</span><span class="mega__l2"><span>prices</span>')
    # calculator data: work and section names
    def calc(m):
        data = json.loads(m.group(1))
        for mk in data:
            for c in mk['cats']:
                c['name'] = WORKS.get(c['name'], c['name'])
                for it in c['items']:
                    it['name'] = WORKS.get(it['name'], it['name'])
        return ('<script type="application/json" data-calc-data>' + json.dumps(data, ensure_ascii=False) + '</script>'
                '<script type="application/json" data-i18n-works>' + json.dumps(WORKS, ensure_ascii=False) + '</script>')
    doc = re.sub(r'<script type="application/json" data-calc-data>(.*?)</script>', calc, doc, flags=re.S)
    # text nodes outside scripts and review cards
    parts = re.split(r'(<script\b.*?</script>|<blockquote class="rv.*?</blockquote>)', doc, flags=re.S)
    for i, part in enumerate(parts):
        if part.startswith('<script') or part.startswith('<blockquote'):
            continue
        part = re.sub(r'>([^<>]+)<', lambda m: '>' + (tr(m.group(1)) or m.group(1)) + '<', part)
        part = re.sub(r'((?:aria-label|placeholder|alt|content|title|data-yt-title|value)=")([^"]*)(")',
                      lambda m: m.group(1) + e(tr(html.unescape(m.group(2))) or html.unescape(m.group(2)), quote=True) + m.group(3), part)
        parts[i] = part
    doc = ''.join(parts)
    # paths one level deeper, language links
    doc = doc.replace('href="../favicon.png"', 'href="../../favicon.png"').replace('href="../apple-touch-icon.png"', 'href="../../apple-touch-icon.png"')
    doc = doc.replace('../assets/', '../../assets/').replace('"assets/css/style.css"', '"../assets/css/style.css"').replace('"assets/js/tw.js"', '"../assets/js/tw.js"')
    doc = doc.replace("url('../../assets/", "url('../../assets/")
    doc = doc.replace(f'<link rel="canonical" href="{ru_url}">', f'<link rel="canonical" href="{en_url}">')
    doc = doc.replace(f'<link rel="alternate" hreflang="en" href="{en_url}">', f'<link rel="alternate" hreflang="ru" href="{ru_url}">')
    doc = re.sub(r'<a class="tool tool--lang" href="[^"]*" hreflang="en" lang="en" aria-label="English version">EN</a>',
                 f'<a class="tool tool--lang" href="{other_href}" hreflang="ru" lang="ru" aria-label="Русская версия">RU</a>', doc)
    left = sorted({m for m in re.findall(r'>([^<>]*[А-Яа-яЁё][^<>]*)<', re.sub(r'<script\b.*?</script>|<blockquote class="rv.*?</blockquote>', '', doc, flags=re.S))})
    return doc, left


import os
os.makedirs('v3/en', exist_ok=True)
for name, ru_url, en_url, other in [
    ('index.html', 'https://dirol982.github.io/vagmotors/v3/', 'https://dirol982.github.io/vagmotors/v3/en/', '../'),
    ('price.html', 'https://dirol982.github.io/vagmotors/v3/price.html', 'https://dirol982.github.io/vagmotors/v3/en/price.html', '../price.html'),
]:
    ru = open('v3/' + name, encoding='utf-8').read()
    # the Russian page points to its English twin
    ru = ru.replace(f'<link rel="alternate" hreflang="ru" href="{ru_url}">', f'<link rel="alternate" hreflang="en" href="{en_url}">')
    open('v3/' + name, 'w', encoding='utf-8').write(ru)
    en, left = to_en(ru, ru_url, en_url, other)
    open('v3/en/' + name, 'w', encoding='utf-8').write(en)
    print('en/' + name, 'untranslated:', left[:20])
