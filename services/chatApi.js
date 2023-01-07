const axios = require('axios');

module.exports = class ChatAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    makeRequest(prompt) {
        return axios.post(
            "https://api.openai.com/v1/chat/gpt",
            {
                prompt
            },
            {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`
                }
            }
            )
    }
}

