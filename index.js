const TelegramBot = require('node-telegram-bot-api');
const figlet = require('figlet');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1682286861:AAEjTGlOj6lkXUFfbQ9_fj3OSeUWPzpWDYw';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});



bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  figlet.text('test', (error, string) => {
    bot.sendMessage(chatId, string);
  })
  // bot.sendMessage(chatId, 'Received your message');

});