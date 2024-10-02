const fs = require('fs');
const path = require('path');
const { InputFile } = require('grammy');

const commandHandler = async (ctx, keyboard = null, customCommand = null) => {
  const command = customCommand ? customCommand : ctx.update.message.text.slice(1);
  const filePath = path.join(__dirname, `./../content/commands/${command}.md`);
  const data = fs.readFileSync(filePath, 'utf-8');
  if (keyboard !== null) {
    await ctx.reply(data, { parse_mode: "MarkdownV2", reply_markup: keyboard });
  } else {
    await ctx.reply(data, { parse_mode: "MarkdownV2" });
  }
};

const taroHandler = async (ctx, keyboard, pathToFile = null) => {
  filePath = path.join(__dirname, `./../content/taro/${pathToFile}.md`);
  const data = fs.readFileSync(filePath, 'utf-8');
  await ctx.reply(data, { parse_mode: "MarkdownV2", reply_markup: keyboard });
};

function getRandomNumber(start, end) {
  return Math.floor(Math.random() * end) + start;
}

const cardInformationGeneration = {
  cups: {
    startGeneration: 1,
    endGeneration: 14,
  },
  maj: {
    startGeneration: 0,
    endGeneration: 21,
  },
  pents: {
    startGeneration: 1,
    endGeneration: 14,
  },
  swords: {
    startGeneration: 1,
    endGeneration: 14,
  },
  wands: {
    startGeneration: 1,
    endGeneration: 14,
  },
};

const mastiСard = ['maj', 'wands', 'pents', 'swords', 'cups'];

const taroRandomCardHandler = async (ctx, keyboard = null) => {
  const mastiName = mastiСard[getRandomNumber(0, 4)];
  const randomNumber = getRandomNumber(cardInformationGeneration[mastiName].startGeneration, cardInformationGeneration[mastiName].endGeneration);
  const normalizedNumber = randomNumber < 10 ? `0${randomNumber}` : randomNumber;
  const cardName = `${mastiName}${normalizedNumber}`;
  const filePathCard = path.join(__dirname, `./../assets/cards/${cardName}.jpg`);
  const text = `Ответ: ${cardName}`;
  if (!fs.existsSync(filePathCard)) {
    console.error(`Файл ${filePathCard} не найден`);
    await ctx.reply('Почему\-то карты не хотят вставать с кровати 🤷‍♂️\. Попробуйте позже ⛺\.');
    return;
  }
  if (keyboard !== null) {
    await ctx.replyWithPhoto(new InputFile(filePathCard), { caption: text, parse_mode: "MarkdownV2", reply_markup: keyboard });
  } else {
    await ctx.replyWithPhoto(new InputFile(filePathCard), { caption: text, parse_mode: "MarkdownV2" });
  }
};

const candlesHandler = async (ctx, keyboard) => {
  const filePathCandles = path.join(__dirname, `./../assets/candles/candle.jpg`);
  const filePath = path.join(__dirname, `./../content/commands/candle.md`);
  const data = fs.readFileSync(filePath, 'utf-8');
  await ctx.replyWithPhoto(new InputFile(filePathCandles), { caption: data, parse_mode: "MarkdownV2", reply_markup: keyboard });
};

module.exports = { commandHandler, taroHandler, taroRandomCardHandler, candlesHandler };