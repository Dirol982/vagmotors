# Собирает v4 = v3 + слой анимаций и интерактива (v4/assets/css/motion.css, v4/assets/js/motion.js),
# бегущая строка марок и блок «Проверьте гарантию». Стили и скрипты v3 подключаются из ../v3/.
# Запуск из корня репозитория после tools/build-v3.py: python3 tools/build-v4.py
import os
import re

TICKER = '<div class="ticker" aria-hidden="true"><div class="ticker__track"><span>Volkswagen<i>·</i></span><span>Audi<i>·</i></span><span>Škoda<i>·</i></span><span>SEAT<i>·</i></span><span>Porsche<i>·</i></span><span>Bentley<i>·</i></span></div></div>'

WARRANTY = {
    'ru': dict(label='Гарантия', h2='Проверьте гарантию',
               lede='Сдвиньте ползунки: сколько прошло после ремонта у нас. Действует то, что наступит раньше — срок или пробег.',
               km='Пробег после ремонта', mo='Прошло после ремонта', hint='Считается по условиям гарантии VAG MOTORS.',
               tiers=[('ТО и регулировка', '2 000 км · 1 месяц', 2000, 1), ('Ремонт с лицензионными запчастями', '10 000 км · 6 месяцев', 10000, 6),
                      ('Ремонт с оригинальными запчастями', '20 000 км · 12 месяцев', 20000, 12)],
               note='Ремонт с запчастями клиента — гарантия только на работу: 1 месяц или 2 000 км.', kmv='3 000 км', mov='2 месяца'),
    'en': dict(label='Warranty', h2='Check your warranty',
               lede='Move the sliders: how long since your repair with us. Whichever comes first ends it — time or mileage.',
               km='Mileage since repair', mo='Time since repair', hint='Based on the VAG MOTORS warranty terms.',
               tiers=[('Service and adjustment', '2,000 km · 1 month', 2000, 1), ('Repair with licensed parts', '10,000 km · 6 months', 10000, 6),
                      ('Repair with genuine parts', '20,000 km · 12 months', 20000, 12)],
               note='Repairs with customer-supplied parts: labour-only warranty, 1 month or 2,000 km.', kmv='3,000 km', mov='2 months'),
}


def warranty(lang):
    w = WARRANTY[lang]
    tiers = ''.join(
        f'<div class="tile wc__tier" data-tier data-km="{k}" data-mo="{m}"><p class="label">{name}</p><p class="tile__big">{terms}</p>'
        f'<p class="wc__state" data-state><i></i></p><div class="wc__bar"><span></span></div></div>'
        for name, terms, k, m in w['tiers'])
    return f'''<section class="sec" id="warranty">
  <div class="wrap">
    <div class="sec__head">
      <p class="label">{w['label']}</p>
      <h2 class="h2">{w['h2']}</h2>
      <p class="muted lede">{w['lede']}</p>
    </div>
    <div class="wc" data-wc>
      <div class="tile wc__ctrl">
        <div class="wc__row"><div class="wc__top"><label class="label" for="wc-km">{w['km']}</label><output class="wc__val num" for="wc-km" data-wc-km-out>{w['kmv']}</output></div>
          <input type="range" id="wc-km" min="0" max="25000" step="500" value="3000" data-wc-km></div>
        <div class="wc__row"><div class="wc__top"><label class="label" for="wc-mo">{w['mo']}</label><output class="wc__val num" for="wc-mo" data-wc-mo-out>{w['mov']}</output></div>
          <input type="range" id="wc-mo" min="0" max="15" step="1" value="2" data-wc-mo></div>
        <p class="wc__hint">{w['hint']}</p>
      </div>
      <div class="wc__tiers" aria-live="polite">{tiers}</div>
    </div>
    <p class="tiny muted" style="margin-top:14px">{w['note']}</p>
  </div>
</section>
'''


def convert(src, dst, lang, depth):
    up = '../' * depth          # v4/ → 1, v4/en/ → 2
    doc = open(src, encoding='utf-8').read()
    css_v3 = 'assets/css/style.css' if depth == 1 else '../assets/css/style.css'
    js_v3 = 'assets/js/tw.js' if depth == 1 else '../assets/js/tw.js'
    doc = doc.replace(f'href="{css_v3}">', f'href="{up}v3/assets/css/style.css">\n<link rel="stylesheet" href="{"" if depth == 1 else "../"}assets/css/motion.css">')
    doc = doc.replace(f'src="{js_v3}" defer></script>', f'src="{up}v3/assets/js/tw.js" defer></script>\n<script src="{"" if depth == 1 else "../"}assets/js/motion.js" defer></script>')
    doc = doc.replace('dirol982.github.io/vagmotors/v3/', 'dirol982.github.io/vagmotors/v4/')
    # переключатель версий ведёт обратно на v3
    doc = re.sub(r'<a class="tool tool--ver" href="([^"]*)v4/([^"]*)" aria-label="[^"]*">v4</a>',
                 lambda m: f'<a class="tool tool--ver" href="{m.group(1)}v3/{m.group(2)}" aria-label="{"Static version: v3" if lang == "en" else "Версия без анимаций: v3"}">v3</a>', doc)
    doc = doc.replace('<html lang="', '<html class="v4" lang="', 1)
    if 'id="about"' in doc:
        doc = doc.replace('<section class="sec" id="about">', TICKER + '\n\n<section class="sec" id="about">', 1)
        doc = doc.replace('<section class="sec" id="workshop"', warranty(lang) + '\n<section class="sec" id="workshop"', 1)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    open(dst, 'w', encoding='utf-8').write(doc)


for name in ['index.html', 'price.html']:
    convert(f'v3/{name}', f'v4/{name}', 'ru', 1)
    convert(f'v3/en/{name}', f'v4/en/{name}', 'en', 2)
print('v4 built')
