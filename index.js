const TG = require('telegram-bot-api')

const api = new TG({
    token: '1682286861:AAEjTGlOj6lkXUFfbQ9_fj3OSeUWPzpWDYw'
})

api.on('message', msg => {
    api.sendMessage(msg.chat.id, "Hello, This is all I can say currently");
})

// api.getMe()
// .then(console.log)
// .catch(console.err)