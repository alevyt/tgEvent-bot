const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');
const moment = require('moment');


var token = '',
      openAiConfig = {};
if(process.env.NODE_ENV === 'production'){
  console.log('prod');
  const openAiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })
  const token = process.env.token;
} else {
  console.log('local');
  (async function(){
    config = await require('./local.config.json');
    console.log('after await', config.token);
    openAiConfig = new Configuration({
      apiKey: config.OPENAI_API_KEY
    })
    token = config.token;
    console.log('token1', token);
  })()
}

const pbApiUrl = `https://api.privatbank.ua/p24api/exchange_rates?json&date=${moment(new Date()).add(-1, 'days').format('DD.MM.YYYY')}`;
const openai = new OpenAIApi(openAiConfig);


// Create a bot that uses 'polling' to fetch new updates
setTimeout(()=>{
  console.log('token', token)
  bot = new TelegramBot(token, {polling: true});
}, 1000);

async function createCompletion(promt){
  return completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: promt,
  });
}

function exchange(chatId){
  console.log('showing exchange rate');
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

function about(chatId, query){
  // console.log(chatId, query);
  bot.sendMessage(chatId, `Hi ${query.from.first_name}! This is a test bot for creating events`)
}

function newEvent(chatId, query){
  const message = query;
  bot.sendMessage(chatId, "Event name");
  
}

function defaultMessage(chatId, data){
  bot.sendMessage(chatId, '?');
}

bot.onText(/\/echo (.+)/, (msg, match) => {
  console.log('message', msg);
  const chatId = msg.chat.id;
})

bot.on('callback_query', query => {
  let chatId = query.message.chat.id;
  console.log('callback_query', query);

  switch (query.data){
    case '/exchange': exchange(chatId); break;
    case '/about': about(chatId, query); break;
    case '/new_event': newEvent(chatId, query); break;
    default: defaultMessage(chatId, query.data);
  }
  

})