export interface NotificationMessage {
  id: string;
  day: number;
  timeOfDay: 'morning' | 'evening' | 'day';
  category: 'start' | 'support' | 'celebration' | 'final';
  messages: {
    ua: string;
    en: string;
    es: string;
  };
}

export const NOTIFICATION_DATA: NotificationMessage[] = [
    {
    id: 'welcome_home',
    day: 0,
    timeOfDay: 'day',
    category: 'start',
    messages: {
      ua: '🎉 Вітаємо вдома! Ти зробив(ла) перший крок до свободи 🚭 {{buddy_name}} тут, щоб підтримати тебе!',
      en: '🎉 Welcome home! You\'ve taken the first step to freedom 🚭 {{buddy_name}} is here to support you!',
      es: '🎉 ¡Bienvenido a casa! ¡Has dado el primer paso hacia la libertad 🚭 {{buddy_name}} está aquí para apoyarte!'
    }
  },
  {
    id: 'day_1_morning',
    day: 1,
    timeOfDay: 'morning',
    category: 'start',
    messages: {
      ua: '👋 Привіт, це я, {{buddy_name}}. Я твій друг і буду поруч, поки ти кидаєш 🚭 Почнемо цей шлях разом!',
      en: '👋 Hi, it\'s me, {{buddy_name}}. I\'m your friend and I\'ll be with you while you quit 🚭 Let\'s start this journey together!',
      es: '👋 Hola, soy yo, {{buddy_name}}. Soy tu amigo y estaré contigo mientras dejas de fumar 🚭 ¡Empecemos este camino juntos!'
    }
  },
  {
    id: 'day_1_evening',
    day: 1,
    timeOfDay: 'evening',
    category: 'support',
    messages: {
      ua: 'Перший вечір без диму 🚭 Ти зробив(ла) це, я пишаюсь тобою 💙',
      en: 'First evening smoke-free 🚭 You did it, I\'m proud of you 💙',
      es: 'Primera noche sin humo 🚭 Lo lograste, estoy orgulloso(a) de ti 💙'
    }
  },
  {
    id: 'day_2_morning',
    day: 2,
    timeOfDay: 'morning',
    category: 'support',
    messages: {
      ua: 'День 2 💪 Ти тримаєшся неймовірно, я поруч.',
      en: 'Day 2 💪 You\'re doing amazing, I\'m here with you.',
      es: 'Día 2 💪 Lo estás haciendo increíble, estoy contigo.'
    }
  },
  {
    id: 'day_2_evening',
    day: 2,
    timeOfDay: 'evening',
    category: 'support',
    messages: {
      ua: 'Два дні й уже економія 💵 Побалуй себе чимось приємним 😉',
      en: 'Two days and already saving 💵 Treat yourself to something nice 😉',
      es: 'Dos días y ya estás ahorrando 💵 Date un gustito 😉'
    }
  },
  {
    id: 'day_3_morning',
    day: 3,
    timeOfDay: 'morning',
    category: 'support',
    messages: {
      ua: '3 дні 🌟 Легені вдячні. Це справжній прогрес!',
      en: '3 days 🌟 Your lungs are thankful. That\'s real progress!',
      es: '3 días 🌟 Tus pulmones lo agradecen. ¡Eso es progreso real!'
    }
  },
  {
    id: 'day_3_evening',
    day: 3,
    timeOfDay: 'evening',
    category: 'support',
    messages: {
      ua: 'Якщо накриє тяга — вдихни 🫁 Я поряд.',
      en: 'If a craving hits — just breathe 🫁 I\'m right here.',
      es: 'Si viene la ansiedad — respira 🫁 Estoy aquí contigo.'
    }
  },
  {
    id: 'day_4_morning',
    day: 4,
    timeOfDay: 'morning',
    category: 'support',
    messages: {
      ua: 'День 4 🚀 Ще один крок до свободи.',
      en: 'Day 4 🚀 One more step toward freedom.',
      es: 'Día 4 🚀 Un paso más hacia la libertad.'
    }
  },
  {
    id: 'day_4_evening',
    day: 4,
    timeOfDay: 'evening',
    category: 'support',
    messages: {
      ua: 'Сьогодні вже 4 перемоги 🏆 Завтра буде ще більше!',
      en: 'Today marks 4 wins 🏆 Tomorrow will bring more!',
      es: 'Hoy son 4 victorias 🏆 ¡Mañana habrá más!'
    }
  },
  {
    id: 'day_5_morning',
    day: 5,
    timeOfDay: 'morning',
    category: 'celebration',
    messages: {
      ua: 'П\'ять днів 🎉 Я аплодую стоячи 👏',
      en: 'Five days 🎉 I\'m giving you a standing ovation 👏',
      es: 'Cinco días 🎉 Te aplaudo de pie 👏'
    }
  },
  {
    id: 'day_5_evening',
    day: 5,
    timeOfDay: 'evening',
    category: 'support',
    messages: {
      ua: 'Увечері тяга сильніша, але ти сильніший(а) 💪',
      en: 'Cravings get stronger at night, but you\'re stronger 💪',
      es: 'Las ansias son más fuertes de noche, pero tú eres más fuerte 💪'
    }
  },
  {
    id: 'day_6_morning',
    day: 6,
    timeOfDay: 'morning',
    category: 'support',
    messages: {
      ua: 'День 6 💪 Тяга слабшає, ти міцнішаєш.',
      en: 'Day 6 💪 Cravings weaken, you grow stronger.',
      es: 'Día 6 💪 Las ganas se debilitan, tú te fortaleces.'
    }
  },
  {
    id: 'day_6_evening',
    day: 6,
    timeOfDay: 'evening',
    category: 'support',
    messages: {
      ua: 'Перед сном подумай: уже майже тиждень 🌙',
      en: 'Before bed, remember: almost a week 🌙',
      es: 'Antes de dormir, recuerda: casi una semana 🌙'
    }
  },
  {
    id: 'day_7_morning',
    day: 7,
    timeOfDay: 'morning',
    category: 'celebration',
    messages: {
      ua: 'Тиждеееень 🎉🔥 Це я, {{buddy_name}}. Ти це зробив(ла)!',
      en: 'One week 🎉🔥 It\'s me, {{buddy_name}}. You did it!',
      es: '¡Una semana 🎉🔥 Soy yo, {{buddy_name}}. ¡Lo lograste!'
    }
  },
  {
    id: 'day_8',
    day: 8,
    timeOfDay: 'day',
    category: 'support',
    messages: {
      ua: 'Другий тиждень 🙌 Кожен день трохи простіший.',
      en: 'Second week 🙌 Every day feels a bit easier.',
      es: 'Segunda semana 🙌 Cada día se siente un poco más fácil.'
    }
  },
  {
    id: 'day_9',
    day: 9,
    timeOfDay: 'day',
    category: 'support',
    messages: {
      ua: 'Є тяга? Вода 💧 + прогулянка — працює.',
      en: 'Craving? Water 💧 + a walk — it works.',
      es: '¿Ansias? Agua 💧 + una caminata — funciona.'
    }
  },
  {
    id: 'day_10',
    day: 10,
    timeOfDay: 'day',
    category: 'celebration',
    messages: {
      ua: '10 днів 🚭 Уяви, скільки диму не потрапило в легені 🫁',
      en: '10 days 🚭 Imagine how much smoke never reached your lungs 🫁',
      es: '10 días 🚭 Imagina cuánto humo no llegó a tus pulmones 🫁'
    }
  },
  {
    id: 'day_11',
    day: 11,
    timeOfDay: 'day',
    category: 'support',
    messages: {
      ua: '11 днів 🌟 Це серйозна серія!',
      en: '11 days 🌟 That\'s a strong streak!',
      es: '11 días 🌟 ¡Esa es una racha fuerte!'
    }
  },
  {
    id: 'day_12',
    day: 12,
    timeOfDay: 'day',
    category: 'support',
    messages: {
      ua: 'День 12. Нікотин ще шепоче, але ти вже гучніший(а).',
      en: 'Day 12. Nicotine still whispers, but you\'re louder now.',
      es: 'Día 12. La nicotina aún susurra, pero ahora tú eres más fuerte.'
    }
  },
  {
    id: 'day_13',
    day: 13,
    timeOfDay: 'day',
    category: 'support',
    messages: {
      ua: '13 днів свободи 💙 Тяга минає, свобода лишається.',
      en: '13 days free 💙 Cravings pass, freedom stays.',
      es: '13 días libres 💙 Las ansias pasan, la libertad se queda.'
    }
  },
  {
    id: 'day_14_morning',
    day: 14,
    timeOfDay: 'morning',
    category: 'celebration',
    messages: {
      ua: 'Два тижні 🎉 Це вже твій новий стандарт!',
      en: 'Two weeks 🎉 This is your new standard!',
      es: 'Dos semanas 🎉 ¡Este es tu nuevo estándar!'
    }
  },
  {
    id: 'day_15',
    day: 15,
    timeOfDay: 'day',
    category: 'support',
    messages: {
      ua: 'Половина місяця 🚀 Вже відчуваєш зміни?',
      en: 'Half a month 🚀 Do you feel the changes already?',
      es: 'Medio mes 🚀 ¿Ya sientes los cambios?'
    }
  },
  {
    id: 'day_20',
    day: 20,
    timeOfDay: 'day',
    category: 'celebration',
    messages: {
      ua: '20 днів 🎉 Велика відмітка!',
      en: '20 days 🎉 Big milestone!',
      es: '20 días 🎉 ¡Gran logro!'
    }
  },
  {
    id: 'day_21',
    day: 21,
    timeOfDay: 'day',
    category: 'support',
    messages: {
      ua: '3 тижні 🚀 Тіло вже працює по-новому.',
      en: '3 weeks 🚀 Your body is already working differently.',
      es: '3 semanas 🚀 Tu cuerpo ya funciona de otra manera.'
    }
  },
  {
    id: 'day_25_morning',
    day: 25,
    timeOfDay: 'morning',
    category: 'support',
    messages: {
      ua: '25 днів 👏 Я аплодую кожному кроку.',
      en: '25 days 👏 I applaud every step.',
      es: '25 días 👏 Aplaudo cada paso.'
    }
  },
  {
    id: 'day_30',
    day: 30,
    timeOfDay: 'day',
    category: 'celebration',
    messages: {
      ua: 'Місяць 🎉 Це я, {{buddy_name}}. Ти герой!',
      en: 'One month 🎉 It\'s me, {{buddy_name}}. You\'re a hero!',
      es: 'Un mes 🎉 Soy yo, {{buddy_name}}. ¡Eres un héroe!'
    }
  },
  {
    id: 'day_40',
    day: 40,
    timeOfDay: 'day',
    category: 'celebration',
    messages: {
      ua: '40 днів 🚭 Це серйозна дистанція.',
      en: '40 days 🚭 A serious milestone.',
      es: '40 días 🚭 Un gran logro.'
    }
  },
  {
    id: 'day_50',
    day: 50,
    timeOfDay: 'day',
    category: 'celebration',
    messages: {
      ua: '50 днів 🌟 Півсотні перемог.',
      en: '50 days 🌟 Fifty victories.',
      es: '50 días 🌟 Cincuenta victorias.'
    }
  },
  {
    id: 'day_60',
    day: 60,
    timeOfDay: 'day',
    category: 'celebration',
    messages: {
      ua: '2 місяці 🎉 Чемпіон(ка) витримки.',
      en: '2 months 🎉 Champion of resilience.',
      es: '2 meses 🎉 Campeón(a) de resistencia.'
    }
  },
  {
    id: 'day_75',
    day: 75,
    timeOfDay: 'day',
    category: 'support',
    messages: {
      ua: '75 днів 💪 Ламаєш старе крок за кроком.',
      en: '75 days 💪 Breaking old habits step by step.',
      es: '75 días 💪 Rompiendo viejos hábitos paso a paso.'
    }
  },
  {
    id: 'day_90',
    day: 90,
    timeOfDay: 'day',
    category: 'celebration',
    messages: {
      ua: '3 місяці 🎉 Це я, {{buddy_name}}. Легендарно!',
      en: '3 months 🎉 It\'s me, {{buddy_name}}. Legendary!',
      es: '3 meses 🎉 Soy yo, {{buddy_name}}. ¡Legendario!'
    }
  },
  {
    id: 'day_120',
    day: 120,
    timeOfDay: 'day',
    category: 'support',
    messages: {
      ua: '4 місяці 🌟 Живеш у свободі.',
      en: '4 months 🌟 Living free.',
      es: '4 meses 🌟 Viviendo libre.'
    }
  },
  {
    id: 'day_150',
    day: 150,
    timeOfDay: 'day',
    category: 'celebration',
    messages: {
      ua: '150 днів 🚀 Пів дороги до півроку.',
      en: '150 days 🚀 Halfway to six months.',
      es: '150 días 🚀 A medio camino de medio año.'
    }
  },
  {
    id: 'day_180',
    day: 180,
    timeOfDay: 'day',
    category: 'celebration',
    messages: {
      ua: 'Пів року 🎉 Це я, {{buddy_name}}. Новий рівень життя.',
      en: 'Half a year 🎉 It\'s me, {{buddy_name}}. A new level of life.',
      es: 'Medio año 🎉 Soy yo, {{buddy_name}}. Un nuevo nivel de vida.'
    }
  },
  {
    id: 'day_210',
    day: 210,
    timeOfDay: 'day',
    category: 'support',
    messages: {
      ua: '210 днів 💪 Тримай курс.',
      en: '210 days 💪 Stay on track.',
      es: '210 días 💪 Mantente en el camino.'
    }
  },
  {
    id: 'day_240',
    day: 240,
    timeOfDay: 'day',
    category: 'support',
    messages: {
      ua: '8 місяців 🌟 Стабільність — це про тебе.',
      en: '8 months 🌟 Stability is your thing.',
      es: '8 meses 🌟 La estabilidad es lo tuyo.'
    }
  },
  {
    id: 'day_270',
    day: 270,
    timeOfDay: 'day',
    category: 'support',
    messages: {
      ua: '270 днів 🚀 Це марафон, і ти попереду.',
      en: '270 days 🚀 This is a marathon, and you\'re ahead.',
      es: '270 días 🚀 Esto es un maratón y vas adelante.'
    }
  },
  {
    id: 'day_300',
    day: 300,
    timeOfDay: 'day',
    category: 'celebration',
    messages: {
      ua: '300 днів 🎉 Ти змінив(ла) своє життя.',
      en: '300 days 🎉 You changed your life.',
      es: '300 días 🎉 Cambiaste tu vida.'
    }
  },
  {
    id: 'day_330',
    day: 330,
    timeOfDay: 'day',
    category: 'support',
    messages: {
      ua: '330 днів 🌟 Майже рік!',
      en: '330 days 🌟 Almost a year!',
      es: '330 días 🌟 ¡Casi un año!'
    }
  },
  {
    id: 'day_365',
    day: 365,
    timeOfDay: 'day',
    category: 'final',
    messages: {
      ua: 'Рік 🎉🎉🎉 Це я, {{buddy_name}}. Ти герой(ка)!',
      en: 'One year 🎉🎉🎉 It\'s me, {{buddy_name}}. You\'re a hero!',
      es: 'Un año 🎉🎉🎉 Soy yo, {{buddy_name}}. ¡Eres un héroe!'
    }
  }
];

// Helper function to get notification by day and time
export const getNotificationByDayAndTime = (day: number, timeOfDay: 'morning' | 'evening' | 'day'): NotificationMessage | undefined => {
  return NOTIFICATION_DATA.find(notification => 
    notification.day === day && notification.timeOfDay === timeOfDay
  );
};

// Helper function to get all notifications for a specific day
export const getNotificationsForDay = (day: number): NotificationMessage[] => {
  return NOTIFICATION_DATA.filter(notification => notification.day === day);
};

// Helper function to get notifications by category
export const getNotificationsByCategory = (category: 'start' | 'support' | 'celebration' | 'final'): NotificationMessage[] => {
  return NOTIFICATION_DATA.filter(notification => notification.category === category);
};

// Helper function to replace placeholders in message
export const replacePlaceholders = (message: string, buddyName: string): string => {
  return message.replace(/\{\{buddy_name\}\}/g, buddyName);
};

// Helper function to get buddy name from selectedBuddyId
export const getBuddyNameForNotification = (selectedBuddyId: string, fallbackBuddyName?: string): string => {
  // Import getBuddyById dynamically to avoid circular imports
  const { getBuddyById } = require('./buddiesData');
  const selectedBuddy = getBuddyById(selectedBuddyId);
  return selectedBuddy?.name || fallbackBuddyName || 'Your Buddy';
};

// Helper function to replace gender-specific text
export const replaceGenderSpecificText = (message: string, gender: 'man' | 'lady' | 'any', language: 'ua' | 'en' | 'es'): string => {
  let processedMessage = message;
  
  if (language === 'ua') {
    // Ukrainian gender-specific replacements
    if (gender === 'man') {
      processedMessage = processedMessage
        .replace(/зробив\(ла\)/g, 'зробив')
        .replace(/пишаюсь тобою/g, 'пишаюся тобою')
        .replace(/тримаєшся/g, 'тримаєшся')
        .replace(/сильніший\(а\)/g, 'сильніший')
        .replace(/міцнішаєш/g, 'міцнішаєш')
        .replace(/гучніший\(а\)/g, 'гучніший')
        .replace(/змінив\(ла\)/g, 'змінив')
        .replace(/герой\(ка\)/g, 'герой')
        .replace(/чемпіон\(ка\)/g, 'чемпіон')
        .replace(/кампіон\(а\)/g, 'кампіон');
    } else if (gender === 'lady') {
      processedMessage = processedMessage
        .replace(/зробив\(ла\)/g, 'зробила')
        .replace(/пишаюсь тобою/g, 'пишаюся тобою')
        .replace(/тримаєшся/g, 'тримаєшся')
        .replace(/сильніший\(а\)/g, 'сильніша')
        .replace(/міцнішаєш/g, 'міцнішаєш')
        .replace(/гучніший\(а\)/g, 'гучніша')
        .replace(/змінив\(ла\)/g, 'змінила')
        .replace(/герой\(ка\)/g, 'героїня')
        .replace(/чемпіон\(ка\)/g, 'чемпіонка')
        .replace(/кампіон\(а\)/g, 'кампіонка');
    }
  } else if (language === 'es') {
    // Spanish gender-specific replacements
    if (gender === 'man') {
      processedMessage = processedMessage
        .replace(/orgulloso\(a\)/g, 'orgulloso')
        .replace(/campeón\(a\)/g, 'campeón');
    } else if (gender === 'lady') {
      processedMessage = processedMessage
        .replace(/orgulloso\(a\)/g, 'orgullosa')
        .replace(/campeón\(a\)/g, 'campeona');
    }
  }
  // English doesn't need gender-specific changes for the current messages
  
  return processedMessage;
};
