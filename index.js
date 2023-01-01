
const TelegramBot = require('node-telegram-bot-api');
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');
const moment = require('moment');


const token = '',
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
    openAiConfig = new Configuration({
      apiKey: config.OPENAI_API_KEY
    })
    token = config.token;
  })()
}

const pbApiUrl = `https://api.privatbank.ua/p24api/exchange_rates?json&date=${moment(new Date()).add(-1, 'days').format('DD.MM.YYYY')}`;
const openai = new OpenAIApi(openAiConfig);


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

async function createCompletion(promt){
  return completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: promt,
  });
}

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Your message '${msg.text}' was recieved`);
  if(msg.text.toString().startsWith('bot')){
    console.log(`asking bot ${msg.text.slice(4)}`)
    try {
      let completion = createCompletion("Are you active right now?")
      console.log('completion', completion.data.choices[0].text);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  } else{
    bot.sendMessage(chatId, "Options:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Exchange Rate",
              callback_data: "/exchange"
            },
            {
              text: "About",
              callback_data: "/about"
            },
            {
              text: "New Event",
              callback_data: "/new_event"
            }
          ]
        ]
        }
      })
  }
});

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