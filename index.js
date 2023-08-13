import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
dotenv.config();

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);
// app.use(bodyParser.json());
// app.post("/sendMessage", (req, res) => {
//   console.log("Recieved", req.body);
//   bot.start((ctx) => {
//     console.log("started");
//     ctx.reply(req.body.name);
//   });
//   res.sendStatus(200);
// });
// app.listen(3000, () => {
//   console.log("server started");
// });
bot.start((ctx) => {
  console.log("started");
  ctx.reply("Hello");
});

bot.launch();
