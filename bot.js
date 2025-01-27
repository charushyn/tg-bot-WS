import { configDotenv } from "dotenv";

import TelegramBot from "node-telegram-bot-api";

configDotenv();

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

export default bot;
