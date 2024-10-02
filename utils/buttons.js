const startButtons = [
  { name: '🔮 Расклад Таро', type: 'navigation' },
  { name: '🕯️ Свечи', type: 'navigation' },
];

const menuTaroButtons = [
  {name: '💘 Отношения', type: 'spheres_relations'},
  {name: '💼 Карьера', type: 'spheres_career'},
  {name: '💪 Здоровье', type: 'spheres_health'},
  {name: '💰 Финансы', type: 'spheres_finance'},
];

const menuTaroQuestionsCareer = [
  {name: '🚪 Какие возможные препятствия могут возникнуть на моем пути?', type: 'questions_1'},
  {name: '🔓Что мешает мне достигать желаемых результатов?', type: 'questions_2'},
  {name: '🎏 Какие ресурсы мне доступны для достижения моих целей?', type: 'questions_3'},
  {name: '🌟 Какова перспектива развития в ближайшем будущем?', type: 'questions_4'},
];

const menuTaroQuestionsFinance = [
  {name: '🎇 Какие основные энергии сейчас влияют на мою ситуацию?', type: 'questions_1'},
  {name: '🔎 Что мне сейчас нужно узнать для достижения успеха?', type: 'questions_2'},
  {name: '🔓 Что мешает мне достигать желаемых результатов?', type: 'questions_3'},
  {name: '🌟 Какова перспектива развития в ближайшем будущем?', type: 'questions_4'},
];

const menuTaroQuestionsHealth = [
  {name: '🎇 Какие основные энергии сейчас влияют на мою ситуацию?', type: 'questions_1'},
  {name: '📈 Как я могу улучшить свое положение?', type: 'questions_2'},
  {name: '🎯 Какие действия принесут мне наибольшую пользу в текущей ситуации?', type: 'questions_3'},
  {name: '🎏 Какие ресурсы мне доступны для достижения моих целей?', type: 'questions_4'},
];

const menuTaroQuestionsRelations = [
  {name: '🎇 Какие основные энергии сейчас влияют на мою ситуацию?', type: 'questions_1'},
  {name: '🎯 Какие действия принесут мне наибольшую пользу в текущей ситуации?', type: 'questions_2'},
  {name: '🔑 Каковы ключевые уроки, которые я должен извлечь из происходящего?', type: 'questions_3'},
  {name: '🔎 Какие советы карты могут дать мне для лучшего понимания своей ситуации?', type: 'questions_4'},
];

const menuTaroFinal = [
  {name: '🔎 Узнать подробнее толкования карт', type: 'contact_menu'},
  {name: '🎲 Сделать подробный расклад', type: 'contact_menu'},
  {name: '📝 Получить совет от карт', type: 'advice'},
]

const menuTaroFinalWithOutAdvice = [
  {name: '🔎 Узнать подробнее толкования карт', type: 'contact_menu'},
  {name: '🎲 Сделать подробный расклад', type: 'contact_menu'},
]

const socialNetworks = [
  {name: '📲 Telegram', type: 'social', url: process.env.CONTACT_URL},
]

module.exports = {
  startButtons,
  menuTaroButtons,
  menuTaroQuestionsCareer,
  menuTaroQuestionsFinance,
  menuTaroQuestionsHealth,
  menuTaroQuestionsRelations,
  menuTaroFinal,
  socialNetworks,
  menuTaroFinalWithOutAdvice,
};
