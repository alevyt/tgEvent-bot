const TelegramBot = require('node-telegram-bot-api');
const Event = require('./event');

class Bot {
  constructor(token) {
    this.bot = new TelegramBot(token, { polling: true });
    this.event = {};

    // Listen for the /newevent command
    this.bot.onText(/\/newevent/, (msg, match) => {
      const chatId = msg.chat.id;
      this.event = {}; // clear any existing event data
      this.bot.sendMessage(chatId, "What's the name of the event?");
    });

    // Listen for the event name message
    this.bot.on('message', (msg) => {
      console.log('message', msg)
      const chatId = msg.chat.id;
      if (!this.event.name) {
        this.event.name = msg.text;
        this.bot.sendMessage(chatId, `Got it. When is ${this.event.name}? (Please enter in format: DD/MM/YYYY)`);
      } else if (!this.event.date) {
        this.event.date = msg.text;
        this.bot.sendMessage(chatId, `Great. What time does ${this.event.name} start? (Please enter in format: HH:mm)`);
      } else if (!this.event.time) {
        this.event.time = msg.text;
        this.bot.sendMessage(chatId, `Awesome. Please describe ${this.event.name}.`);
      } else if (!this.event.description) {
        this.event.description = msg.text;
        this.bot.sendMessage(chatId, `Event created:\nName: ${this.event.name}\nDate: ${this.event.date}\nTime: ${this.event.time}\nDescription: ${this.event.description}`);
        // Send event notification to specified chat
        // this.bot.sendMessage('-1001927094290', `New event created:\nName: ${this.event.name}\nDate: ${this.event.date}\nTime: ${this.event.time}\nDescription: ${this.event.description}`);
        // this.createEventPoll(this.event.name, this.event.date, this.event.description);
        this.createPoll('-1001927094290', `New event created:\nName: ${this.event.name}\nDate: ${this.event.date}\nTime: ${this.event.time}\nDescription: ${this.event.description}`)
      }
    });
  }

  async createPoll(chatId, description) {
    try {
      const pollOptions = [
        {
          text: 'Yes',
          option: 1,
          voter_count: 0
        },
        {
          text: 'No',
          option: 0,
          voter_count: 0
        }
      ];
  
      const pollData = {
        question: description,
        answers: pollOptions,
        public_voters: false,
        type: 'regular',
        quiz: false,
        multiple_choice: false,
        correct_option_id: null
      };
  
      await this.bot.sendPoll(chatId, description, ['Yes', 'No'], { public_voters: true});
  
    } catch (error) {
      console.error(error);
    }
  }
  

  createEventPoll(name, date, description) {
    const newEvent = new Event(name, date, description);
    const messageText = newEvent.displayInfo();

    const options = {
      reply_markup: {
        keyboard: [['Yes', 'No']],
        one_time_keyboard: true,
      },
    };

    this.bot.sendMessage('-1001927094290', messageText, options);
  }

  start() {
    this.bot.startPolling();
  }

  stop() {
    this.bot.stopPolling();
  }
}

module.exports = Bot;
