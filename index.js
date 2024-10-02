require('dotenv').config();
const { Bot, GrammyError, HttpError, Keyboard,session } = require('grammy');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const { hydrate } = require('@grammyjs/hydrate');
const { createTables, updateUserData, isAdmin, recordUserInteraction, recordSocialNetworkRequest, getUsageStats } = require('./utils/db/db');
const { commandHandler, taroHandler, taroRandomCardHandler, candlesHandler } = require('./utils/handlers');
const { logger} = require('./utils/logger');
const { createKeyboard, createKeyboardWithoutRows } = require('./utils/helpers');
const {
  startButtons,
  menuTaroButtons,
  menuTaroQuestionsFinance,
  menuTaroQuestionsHealth,
  menuTaroQuestionsRelations,
  menuTaroQuestionsCareer,
  socialNetworks,
  menuTaroFinal,
  menuTaroFinalWithOutAdvice
} = require('./utils/buttons');

const botApiKey = process.env.BOT_API_KEY;
const bot = new Bot(botApiKey);

bot.use(session({
  initial: () => ({})
}));
bot.use(hydrate());

let db;
(async () => {
  const dbPath = './utils/db/userData.db';

  const dbExists = fs.existsSync(dbPath);

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  if (!dbExists) {
    await createTables(db);
  }

  logger.info('Database initialized and connection established');
})();

bot.api.setMyCommands([
  {
      command: 'start',
      description: 'Запустить бота'
  },
  {
    command: 'menu',
    description: 'Главное меню'
  },
  // {
  //   command: 'help',
  //     description: 'Помощь'
  // },
  //Help !---------! disabled
]);

//Keyboards
const startMenuKeyboard = createKeyboard(startButtons, true);
const taroMenuKeyboard = createKeyboard(menuTaroButtons);
const taroQuestionsFinanceKeyboard = createKeyboardWithoutRows(menuTaroQuestionsFinance);
const taroQuestionsHealthKeyboard = createKeyboardWithoutRows(menuTaroQuestionsHealth);
const taroQuestionsRelationsKeyboard = createKeyboardWithoutRows(menuTaroQuestionsRelations);
const taroQuestionsCareerKeyboard = createKeyboardWithoutRows(menuTaroQuestionsCareer);
const taroFinalKeyboard = createKeyboard(menuTaroFinal, true);
const socialNetworksKeyboard = createKeyboard(socialNetworks, true);
const taroFinalWithOutAdviceKeyboard = createKeyboard(menuTaroFinalWithOutAdvice, true);
const keyboardBack = new Keyboard().text('Главная менюшка ↩️').resized();

//Comands
bot.command('start', async (ctx) => {
  logger.info(`User ${ctx.from.id} started the bot`);
  await updateUserData(db, ctx.from.id);
  commandHandler(ctx, startMenuKeyboard);
});

bot.command('admin', async (ctx) => {
  if (isAdmin(ctx.from.id, process.env.ADMIN_ID)) {
    const stats = await getUsageStats(db);
    let response = `Статистика использования бота:\nВсего запусков: ${stats.totalStarts}\nИспользовали бота сегодня: ${stats.todayStarts}\nВсего взаимодействий: ${stats.totalInteractions}\nВзаимодействий сегодня: ${stats.todayInteractions}\n\n`;

    response += 'Запросы на социальные сети:\n';
    for (const { networkName, total } of stats.totalSocialNetworkRequests) {
      const today = stats.todaySocialNetworkRequests.find(n => n.networkName === networkName)?.today || 0;
      response += `${networkName} - Всего: ${total}, Сегодня: ${today}\n`;
    }
    await ctx.reply(response);
  } else {
    await ctx.reply('Ой, я не могу распознать твой сигнал 🌑 Похоже мы на разных волнах 🌊');
  }
});

//Social networks handler btn
function handleButtonClicks(items, recordRequest) {
  items.forEach(item => {
    bot.hears(item.name, async (ctx) => {
      await recordUserInteraction(db, ctx.from.id);
      await recordRequest(db, ctx.from.id, item.name);
      let message = '';
      if (item.type === 'social') {
        message = `Вот ссылка на ${item.name}: ${item.url}`;
      }
      await ctx.reply(message, { reply_markup: keyboardBack });
    });
  });
}

handleButtonClicks(socialNetworks, recordSocialNetworkRequest);

//Help !---------! disabled
// bot.command('help', async (ctx) => {
//   logger.info(`User ${ctx.from.id} requested help`);
//   await recordUserInteraction(db, ctx.from.id);
//   commandHandler(ctx);
// });

//Main menu
bot.command('menu', async (ctx) => {
  logger.info(`User ${ctx.from.id} requested main menu command`);
  await recordUserInteraction(db, ctx.from.id);
  commandHandler(ctx, startMenuKeyboard);
});
bot.hears('Главная менюшка ↩️', async (ctx) => {
  logger.info(`User ${ctx.from.id} requested main menu`);
  await recordUserInteraction(db, ctx.from.id);
  commandHandler(ctx, startMenuKeyboard, 'menu');
});

bot.use(async (ctx, next) => {
  logger.info(`User ${ctx.from.id} interacted with the bot`);
  await recordUserInteraction(db, ctx.from.id);
  return next();
});

//Taro
bot.hears('🔮 Расклад Таро', async (ctx) => {
  logger.info(`User ${ctx.from.id} requested tarot`);
  await recordUserInteraction(db, ctx.from.id);
  commandHandler(ctx, taroMenuKeyboard, 'taro');
});
const questionsSphere = menuTaroButtons.map(button => button.name);

//Taro questions sphere
bot.hears(questionsSphere, async (ctx) => {
  logger.info(`User ${ctx.from.id} requested questions sphere`);
  await recordUserInteraction(db, ctx.from.id);
  const questionType = menuTaroButtons.find(button => button.name === ctx.update.message.text).type;
  const pathToAnswer = questionType.split('_');
  const [folder, sphere] = pathToAnswer;
  const pathFile = `${folder}/${sphere}`;
  switch (sphere) {
    case 'career':
      taroHandler(ctx, taroQuestionsCareerKeyboard, pathFile);
      break;
    case 'finance':
      taroHandler(ctx, taroQuestionsFinanceKeyboard, pathFile);
      break;
    case 'health':
      taroHandler(ctx, taroQuestionsHealthKeyboard, pathFile);
      break;
    case 'relations':
      taroHandler(ctx, taroQuestionsRelationsKeyboard, pathFile);
      break;
    default:
      throw new Error('Unknown sphere (case)');
  }
});
const allQuestionsTaro = [
  ...menuTaroQuestionsCareer,
  ...menuTaroQuestionsFinance,
  ...menuTaroQuestionsHealth,
  ...menuTaroQuestionsRelations]
.map(item => item.name);
bot.hears(allQuestionsTaro, async (ctx) => {
  logger.info(`User ${ctx.from.id} requested card random`);
  await recordUserInteraction(db, ctx.from.id);
  taroRandomCardHandler(ctx, taroFinalKeyboard);
});
bot.hears('📝 Получить совет от карт', async (ctx) => {
  logger.info(`User ${ctx.from.id} requested card advice`);
  await recordUserInteraction(db, ctx.from.id);
  taroRandomCardHandler(ctx, taroFinalWithOutAdviceKeyboard);
});
bot.hears(['🔎 Узнать подробнее толкования карт', '🎲 Сделать подробный расклад'], async (ctx) => {
  logger.info(`User ${ctx.from.id} requested menu social from final taro result`);
  await recordUserInteraction(db, ctx.from.id);
  commandHandler(ctx, socialNetworksKeyboard, 'contacts');
});

//Candels
bot.hears('🕯️ Свечи', async (ctx) => {
  logger.info(`User ${ctx.from.id} requested candles`);
  await recordUserInteraction(db, ctx.from.id);
  candlesHandler(ctx, socialNetworksKeyboard);
});

//Message
bot.on('message', async (ctx) => {
  logger.info(`User ${ctx.from.id} requested message`);
  await recordUserInteraction(db, ctx.from.id);
  ctx.reply('Ой, я не могу распознать твой сигнал 🌑 Похоже мы на разных волнах 🌊');
});
//Error
bot.catch((err) => {
  const ctx = err.ctx;
  logger.error(`Error while handling update ${ctx.update.update_id}:`, err);
  ctx.reply('Связь с космосом прервана 🆘. Пожалуйста, попробуйте позже 🌑.');
  console.error(err);
});

bot.start();