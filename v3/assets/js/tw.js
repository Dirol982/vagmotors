// VAGMOTORS v3: живой статус, сезонная плитка, лента отзывов, копирование координат.
// Запись, калькулятор, прайс с заказом, лента цеха и видео — в общем ../assets/js/main.js.
(function () {
  'use strict';

  /* Время в Минске (UTC+3, без перехода на летнее время) */
  var now = new Date(Date.now() + 3 * 3600 * 1000);
  var hour = now.getUTCHours() + now.getUTCMinutes() / 60;
  var month = now.getUTCMonth() + 1;

  /* Статус «открыто / закрыто»: ежедневно 9:00–21:00 */
  var OPEN = 9, CLOSE = 21;
  var isOpen = hour >= OPEN && hour < CLOSE;
  var statusText = isOpen ? 'Открыто до 21:00' : (hour < OPEN ? 'Откроемся в 9:00' : 'Откроемся завтра в 9:00');
  document.querySelectorAll('[data-status]').forEach(function (el) { el.classList.toggle('is-open', isOpen); });
  document.querySelectorAll('[data-status-text]').forEach(function (el) { el.textContent = statusText; });
  var openTitle = document.querySelector('[data-open-title]');
  if (openTitle) {
    openTitle.textContent = statusText;
    openTitle.closest('.tile').classList.toggle('is-open', isOpen);
  }

  /* Сезон для СТО */
  var SEASONS = [
    { months: [10, 11, 12], label: 'Сезон · октябрь–декабрь', title: 'Подготовка к зиме',
      text: 'Антифриз, аккумулятор, свечи накала, компьютерная диагностика.' },
    { months: [1, 2], label: 'Зима', title: 'ТО и диагностика',
      text: 'Плановое ТО по регламенту завода и проверка перед весной.' },
    { months: [3, 4, 5], label: 'Сезон · март–май', title: 'Весеннее ТО',
      text: 'Масло и фильтры, подвеска и тормоза после зимы.' },
    { months: [6, 7, 8, 9], label: 'Лето', title: 'Кондиционер',
      text: 'Диагностика, заправка и ремонт климатической системы.' }
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
      var done = function () { btn.textContent = 'Скопировано'; setTimeout(function () { btn.textContent = 'Скопировать'; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });
})();
