const axios = require('axios');
const moment = require('moment');
const Bot = require('./services/bot')

var token = '',
    apiKey = '',
    bot;

if(process.env.NODE_ENV === 'production'){
  console.log('prod');
  apiKey = process.env.OPENAI_API_KEY
  const token = process.env.token;
  bot = new Bot(token, apiKey);
} else {
  console.log('local');
  (async function(){
    config = await require('./local.config.json');
    console.log('after await', config.token);
    apiKey = config.OPENAI_API_KEY;
    token = config.token;
    console.log('token1', token);
    bot = new Bot(token, apiKey);
  })()
}

// const pbApiUrl = `https://api.privatbank.ua/p24api/exchange_rates?json&date=${moment(new Date()).add(-1, 'days').format('DD.MM.YYYY')}`;

// function exchange(chatId){
//   console.log('showing exchange rate');
//   axios.get(pbApiUrl).then(response => {
//       let rates = response.data.exchangeRate
//       let rate = '';
//       for(i of rates){
//         if(i.currency == 'USD' || i.currency == 'EUR'){
//           rate += `currency: ${i.currency} rate: ${i.saleRateNB}\n`;
//         } 
//       }
//       bot.sendMessage(chatId, rate.toString());
//     }).catch(error => {
//       console.error(error);
//     })
// }