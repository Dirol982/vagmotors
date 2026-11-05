// VAGMOTORS v3: живой статус, сезонная плитка, лента отзывов, копирование координат.
// Запись, калькулятор, прайс с заказом, лента цеха и видео — в общем ../assets/js/main.js.
(function () {
  'use strict';
  var EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
  var L = function (ru, en) { return EN ? en : ru; };

  /* Светлая и тёмная тема: выбор запоминается */
  var root = document.documentElement;
  var themeBtns = document.querySelectorAll('[data-theme-toggle]');
  var paintTheme = function () {
    var light = root.dataset.theme === 'light';
    themeBtns.forEach(function (b) {
      b.setAttribute('aria-label', light ? L('Тёмная тема', 'Dark theme') : L('Светлая тема', 'Light theme'));
      b.setAttribute('aria-pressed', String(light));
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', light ? '#f4f3f0' : '#0a0a0a');
  };
  themeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('vag-theme', root.dataset.theme); } catch (e) {}
      paintTheme();
    });
  });
  paintTheme();

  /* Время в Минске (UTC+3, без перехода на летнее время) */
  var now = new Date(Date.now() + 3 * 3600 * 1000);
  var hour = now.getUTCHours() + now.getUTCMinutes() / 60;
  var month = now.getUTCMonth() + 1;

  /* Статус «открыто / закрыто»: ежедневно 9:00–21:00 */
  var OPEN = 9, CLOSE = 21;
  var isOpen = hour >= OPEN && hour < CLOSE;
  var statusText = isOpen ? L('Открыто до 21:00', 'Open until 21:00') : (hour < OPEN ? L('Откроемся в 9:00', 'Opens at 9:00') : L('Откроемся завтра в 9:00', 'Opens tomorrow at 9:00'));
  document.querySelectorAll('[data-status]').forEach(function (el) { el.classList.toggle('is-open', isOpen); });
  document.querySelectorAll('[data-status-text]').forEach(function (el) { el.textContent = statusText; });
  var openTitle = document.querySelector('[data-open-title]');
  if (openTitle) {
    openTitle.textContent = statusText;
    openTitle.closest('.tile').classList.toggle('is-open', isOpen);
  }

  /* Сезон для СТО */
  var SEASONS = [
    { months: [10, 11, 12], label: L('Сезон · октябрь–декабрь', 'Season · October–December'), title: L('Подготовка к зиме', 'Winter prep'),
      text: L('Антифриз, аккумулятор, свечи накала, компьютерная диагностика.', 'Coolant, battery, glow plugs, computer diagnostics.') },
    { months: [1, 2], label: L('Зима', 'Winter'), title: L('ТО и диагностика', 'Service and diagnostics'),
      text: L('Плановое ТО по регламенту завода и проверка перед весной.', 'Scheduled service to the factory plan and a check before spring.') },
    { months: [3, 4, 5], label: L('Сезон · март–май', 'Season · March–May'), title: L('Весеннее ТО', 'Spring service'),
      text: L('Масло и фильтры, подвеска и тормоза после зимы.', 'Oil and filters, suspension and brakes after winter.') },
    { months: [6, 7, 8, 9], label: L('Лето', 'Summer'), title: L('Кондиционер', 'Air conditioning'),
      text: L('Диагностика, заправка и ремонт климатической системы.', 'A/C diagnostics, recharge and repair.') }
  ];
  var season = SEASONS.filter(function (s) { return s.months.indexOf(month) !== -1; })[0];
  if (season) {
    var set = function (sel, v) { var el = document.querySelector(sel); if (el) el.textContent = v; };
    set('[data-season-label]', season.label);
    set('[data-season-title]', season.title);
    set('[data-season-text]', season.text);
  }

  /* Лента отзывов: стрелки */
  var track = document.getElementById('reviewsTrack');
  document.querySelectorAll('[data-rv]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!track) return;
      var card = track.querySelector('.rv');
      var step = card ? card.getBoundingClientRect().width + 8 : 320;
      track.scrollBy({ left: step * +btn.getAttribute('data-rv'), behavior: 'smooth' });
    });
  });

  /* Копирование координат */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var label = btn.textContent;
      var done = function () { btn.textContent = L('Скопировано', 'Copied'); setTimeout(function () { btn.textContent = label; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });
})();
