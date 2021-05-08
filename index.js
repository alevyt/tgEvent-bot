const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const moment = require('moment');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: './data/testdata.csv',
  // append: true,
  header: [
    {id: 'name', title: 'Name'},
    {id: 'date', title: 'Date'},
    {id: 'amount', title: 'Amount'},
  ]
});

const pbApiUrl = `https://api.privatbank.ua/p24api/exchange_rates?json&date=${moment(new Date()).add(-1, 'days').format('DD.MM.YYYY')}`;

// replace the value below with the Telegram token you receive from @BotFather
const token = '1682286861:AAEjTGlOj6lkXUFfbQ9_fj3OSeUWPzpWDYw';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

let mockData = [
  {
    name: "food",
    date: moment(new Date()).format('DD.MM.YYYY'),
    amount: 100
  }
]

// csvWriter.writeRecords(mockData).then(console.log('successfuly saved'));

bot.on('message', (msg) => {
  /* msg example
  { message_id: 107,
    from: 
     { id: 213896524,
       is_bot: false,
       first_name: 'Andrii',
       username: 'KarmaStrikesBack',
       language_code: 'uk' },
    chat: 
     { id: 213896524,
       first_name: 'Andrii',
       username: 'KarmaStrikesBack',
       type: 'private' },
    date: 1620430746,
    text: 'Dchdd' }
*/
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Your message '${msg.text}' was recieved`);
  bot.sendMessage(chatId, "Keyboard:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Get exchange rate",
            callback_data: 'exchange'
          },
          {
            text: "Add record",
            callback_data: 'add_record'
          }
        ]
      ]
      }
    })
});

bot.on('callback_query', query => {
  let chatId = query.message.chat.id;
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

})