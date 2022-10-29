const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const moment = require('moment');
// const csv = require('csv-parser');
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const csvWriter = createCsvWriter({
//   path: './data/testdata.csv',
//   // append: true,
//   header: [
//     {id: 'name', title: 'Name'},
//     {id: 'date', title: 'Date'},
//     {id: 'amount', title: 'Amount'},
//   ]
// });

const pbApiUrl = `https://api.privatbank.ua/p24api/exchange_rates?json&date=${moment(new Date()).add(-1, 'days').format('DD.MM.YYYY')}`;
const token = process.env.token;


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  // bot.sendMessage(chatId, `Your message '${msg.text}' was recieved`);
  bot.sendMessage(chatId, "Options:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Exchange Rate",
            callback_data: "exchange"
          }
        ]
      ]
      }
    })
});

const keyboard = [];

function exchange(chatId){
  axios.get(pbApiUrl).then(response => {
      let rates = response.data.exchangeRate
      let rate = '';
      for(i of rates){
        if(i.currency == 'USD' || i.currency == 'EUR'){
          rate += `currency: ${i.currency} rate: ${i.saleRateNB}\n`;
        } 
      }
      bot.sendMessage(chatId, rate.toString());
    }).catch(error => {
      console.error(error);
    })
}

function about(chatId){
  bot.sendMessage(chatId, "This is a test bot for creating events")
}

function newEvent(chatId, quesry){
  const message = quesry;
  bot.sendMessage(chatId, message);
  
}

function defaultMessage(chatId, data){
  bot.sendMessage(chatId, '?');
  console.log(data);
}

bot.on('callback_query', query => {
  // console.log(query)
  let chatId = query.message.chat.id;
  

  switch (query.data){
    case 'exchange': exchange(chatId); break;
    case 'about': about(chatId); break;
    case 'new_event': newEvent(chatId, query); break;
    default: defaultMessage(chatId, query.data);
  }
  

})