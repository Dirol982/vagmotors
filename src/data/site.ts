export const site = {
  name: 'VAGMOTORS',
  legalName: 'ООО «ВАГМОТОРС»',
  city: 'Минск',
  address: '1-й Твёрдый переулок, 11, корпус 3',
  addressShort: '1-й Твёрдый пер., 11',
  hours: 'Ежедневно 9:00–21:00',
  open: 9,
  close: 21,
  geo: { lat: 53.908665, lng: 27.601528 },
  email: 'info@vagmotors.by',
  service: {
    label: '+375 29 620-04-21',
    tel: '+375296200421',
  },
  parts: {
    label: '+375 29 620-04-27',
    tel: '+375296200427',
  },
  messengers: {
    telegram: 'https://t.me/%2B375296200421',
    telegramChannel: 'https://t.me/VagMotors_Service',
    viber: 'viber://chat?number=%2B375296200421',
    viberParts: 'viber://chat?number=%2B375296200427',
    whatsapp: 'https://wa.me/375296200421',
  },
  social: {
    instagram: 'https://www.instagram.com/vagmotorsby/',
    vk: 'https://vk.com/vagmotorsby',
    facebook: 'https://www.facebook.com/vagmotorsby',
    ok: 'https://ok.ru/vagmotorsby',
  },
  reviewsLinks: {
    yandex: 'https://yandex.by/maps/org/vag_motors/10551282929/reviews/?ll=27.601528%2C53.908665&z=16',
    google:
      'https://www.google.by/search?q=%D0%B2%D0%B0%D0%B3%D0%BC%D0%BE%D1%82%D0%BE%D1%80%D1%81+%D0%BC%D0%B8%D0%BD%D1%81%D0%BA#lrd=0x46dbcf9fa720bf4d:0xb7ecc47dd3aa4bc3,1,,,',
    vk: 'https://vk.com/topic-170976131_39353822',
  },
  map: 'https://yandex.ru/map-widget/v1/?um=constructor%3A8595801120e96e03aa72430106bf861dee2073469a258e121d6f2357499895c9&source=constructor',
  mapLink: 'https://yandex.by/maps/org/vag_motors/10551282929/?ll=27.601528%2C53.908665&z=16',
  requisites: {
    company: 'Общество с ограниченной ответственностью «ВАГМОТОРС»',
    director: 'Директор Большаков Роман Родионович, действует на основании устава',
    address: '220037, г. Минск, пер. Твёрдый 1-й, д. 11, пом. 2, каб. 5',
    phone: '+375 29 187-75-65',
    email: 'Vagmotorsby@gmail.com',
    account: 'р/с BY56PJCB30120559261000000933 в ЦБУ № 100 ОАО «Приорбанк», г. Минск, ул. Радиальная, 38-А',
    bic: 'PJCBBY2X',
    unp: '193087869',
  },
};

/** Ordered by how often each make comes through the gate; type size bills them. */
export const makes = [
  { id: 'vw', name: 'Volkswagen', short: 'VW', tier: 1 },
  { id: 'audi', name: 'Audi', short: 'Audi', tier: 1 },
  { id: 'skoda', name: 'Škoda', short: 'Škoda', tier: 1 },
  { id: 'porsche', name: 'Porsche', short: 'Porsche', tier: 2 },
  { id: 'seat', name: 'SEAT', short: 'SEAT', tier: 2 },
  { id: 'bentley', name: 'Bentley', short: 'Bentley', tier: 2 },
] as const;

export const nav = [
  { href: '#services', label: 'Услуги' },
  { href: '#calc', label: 'Калькулятор' },
  { href: '#dsg', label: 'DSG' },
  { href: '#warranty', label: 'Гарантия' },
  { href: 'price/', label: 'Цены' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#contacts', label: 'Контакты' },
];
