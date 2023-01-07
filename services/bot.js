const TelegramBot = require('node-telegram-bot-api');
const ChatAPI = require('./chatApi');

module.exports =  class Bot{
  constructor(token, chatApiKey) {
    this.bot = new TelegramBot(token, {polling: true});  
    this.chatAPI = new ChatAPI(chatApiKey);
    
    this.bot.onText(/\/echo (.+)/, (msg, match) => {
      console.log('message', msg);
      const chatId = msg.chat.id;
    })
    
    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, `Your message '${msg.text}' was recieved`);
      if(msg.text.toString().startsWith('bot')){
        console.log(`asking bot ${msg.text.slice(4)}`)
        try {
          this.chatAPI.makeRequest(msg.text.slice(4)).then((response)=>{
            console.log(response)
            this.bot.sendMessage(chatId, `Here is response from bot:
            ${response.data.response}`)
          })
        } catch (error) {
          if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
          } else {
            console.log(error.message);
          }
        }
      } else{
        this.bot.sendMessage(chatId, "Options:", {
          reply_markup: {
            inline_keyboard: [
              [
                // {
                //   text: "Exchange Rate",
                //   callback_data: "/exchange"
                // },
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
    
    this.bot.on('callback_query', query => {
      let chatId = query.message.chat.id;
      console.log('callback_query', query);
    
      switch (query.data){
        case '/exchange': exchange(chatId); break;
        case '/about': about(chatId, query); break;
        case '/new_event': newEvent(chatId, query); break;
        default: defaultMessage(chatId, query.data);
      }
    })
  }

  about = function(chatId, query){
    // console.log(chatId, query);
    this.bot.sendMessage(chatId, `Hi ${query.from.first_name}! This is a test bot for creating events`)
  }

  newEvent = function(chatId, query){
    const message = query;
    this.bot.sendMessage(chatId, "Event name");
    
  }

  defaultMessage = function(chatId, data){
    this.bot.sendMessage(chatId, '?');
  }
}