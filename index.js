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

const vwApiURL = 'https://sklad.volkswagen.ua/mainframe/internal/cars/?svn=true&mg=199&hp=min%3A210&country=UA&brand=VW&filterSet=RESULT_LIST_PAGE&evaluate=true&_size=15'

// replace the value below with the Telegram token you receive from @BotFather
const token = '1682286861:AAEjTGlOj6lkXUFfbQ9_fj3OSeUWPzpWDYw';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


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
            text: "Get List",
            callback_data: 'getList'
          },
          {
            text: "Exchange Rate",
            callback_data: "exchange"
          }
        ]
      ]
      }
    })
});

function getList(chatId){
  axios.get(vwApiURL).then(response => {
    // console.log(response)
    const keyboard = []
    response.data.cars.forEach(item => {
      // console.log(item.dealer.city, item.model.name, item.colorData.exterior.name);
      keyboard.push([{
        text: `${item.model.variant} ${item.colorData.exterior.name} ${item.dealer.city}`,
        callback_data: 'car'
      }]);
    })
    bot.sendMessage(chatId, "Options:", {
      reply_markup: {
        inline_keyboard: keyboard
      }
    })
  }).catch(error => {
    console.error(error)
  })
}

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

function defaultMessage(chatId){
  bot.sendMessage(chatId, '?');
}

bot.on('callback_query', query => {
  // console.log(query)
  let chatId = query.message.chat.id;
  

  switch (query.data){
    case 'getList': getList(chatId); break;
    case 'exchange': exchange(chatId); break;
    default: defaultMessage(chatId)
  }
  

})