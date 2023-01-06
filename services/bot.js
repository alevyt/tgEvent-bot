const TelegramBot = require('node-telegram-bot-api');

export class Bot{
    constructor(token) {
        
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
}