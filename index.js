const axios = require('axios');
const Bot = require('./services/bot')

var token = '',
    apiKey = '',
    bot;

if(process.env.NODE_ENV === 'production'){
  console.log('prod');
  const token = process.env.token;
  bot = new Bot(token);
} else {
  console.log('local');
  (async function(){
    config = await require('./local.config.json');
    token = config.token;
    bot = new Bot(token);
  })()
}