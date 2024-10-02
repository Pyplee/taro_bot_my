const fs = require('fs');
const { logger} = require('../logger');

async function createTables(db) {
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    timesStarted INTEGER DEFAULT 0,
    lastSeen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    interactionTime TIMESTAMP
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS socialNetworkRequests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    networkName TEXT,
    requestTime TIMESTAMP
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS promoCodeRequests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    promoName TEXT,
    requestTime TIMESTAMP
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    message TEXT,
    media_type TEXT,
    media_id TEXT,
    replied INTEGER DEFAULT 0,
    first_name TEXT,
    username TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  logger.info('Tables created or already exist');
};

// Функция для обновления данных о пользователе
async function updateUserData(db, userId) {
  await db.run(`INSERT INTO users (id, timesStarted, lastSeen) VALUES (?, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET timesStarted = timesStarted + 1, lastSeen = CURRENT_TIMESTAMP`, [userId]);
}

// Функция для проверки, является ли пользователь администратором
function isAdmin(userId, adminId) {
  return userId.toString() === adminId;
}

// Функция для записи взаимодействия пользователя
async function recordUserInteraction(db, userId) {
  await db.run(`INSERT INTO interactions (userId, interactionTime) VALUES (?, CURRENT_TIMESTAMP)`, [userId]);
}

// Функция для записи запроса на социальную сеть
async function recordSocialNetworkRequest(db, userId, networkName) {
  await db.run(`INSERT INTO socialNetworkRequests (userId, networkName, requestTime) VALUES (?, ?, CURRENT_TIMESTAMP)`, [userId, networkName]);
}

// Функция для получения статистики использования бота
async function getUsageStats(db) {
  const totalStarts = await db.get(`SELECT SUM(timesStarted) as total FROM users`);
  const todayStarts = await db.get(`SELECT COUNT(*) as today FROM users WHERE date(lastSeen) = date('now')`);
  const totalInteractions = await db.get(`SELECT COUNT(*) as total FROM interactions`);
  const todayInteractions = await db.get(`SELECT COUNT(*) as today FROM interactions WHERE date(interactionTime) = date('now')`);

  const totalSocialNetworkRequests = await db.all(`SELECT networkName, COUNT(*) as total FROM socialNetworkRequests GROUP BY networkName`);
  const todaySocialNetworkRequests = await db.all(`SELECT networkName, COUNT(*) as today FROM socialNetworkRequests WHERE date(requestTime) = date('now') GROUP BY networkName`);

  const totalPromoCodeRequests = await db.all(`SELECT promoName, COUNT(*) as total FROM promoCodeRequests GROUP BY promoName`);
  const todayPromoCodeRequests = await db.all(`SELECT promoName, COUNT(*) as today FROM promoCodeRequests WHERE date(requestTime) = date('now') GROUP BY promoName`);

  return {
    totalStarts: totalStarts.total,
    todayStarts: todayStarts.today,
    totalInteractions: totalInteractions.total,
    todayInteractions: todayInteractions.today,
    totalSocialNetworkRequests,
    todaySocialNetworkRequests,
    totalPromoCodeRequests,
    todayPromoCodeRequests
  };
}

module.exports = { createTables, updateUserData, isAdmin, recordUserInteraction, recordSocialNetworkRequest, getUsageStats };