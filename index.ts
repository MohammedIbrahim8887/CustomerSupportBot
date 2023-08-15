import { Bot, Context } from "grammy";
import dotenv from "dotenv";
import express from "express";
import { prisma } from "./prisma/prisma";
dotenv.config();

const app = express();
app.use(express.json());
let data: User;
let isSent: boolean = false;

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("start", async (ctx) => {
  console.log(ctx.chat);

  if (ctx.chat.type === "private") {
    const user = await prisma.user.findUnique({
      where: { id: ctx.chat.id }, // No need for conversion
    });

    if (!user) {
      await prisma.user.create({
        data: {
          id: ctx.chat.id,
          first_name: ctx.chat.first_name,
        },
      });
    }

    if (isSent) {
      ctx.reply(`Hello ${data.first_name}`);
    } else {
      ctx.reply("Hello!");
    }
  } else {
    // Handle group chats or other chat types
    ctx.reply("Hello!");
  }
});

const fetchAllUsers = async (): Promise<number[]> => {
  return await prisma.user.findMany().then((users) => {
    return users.map((data) => data.id as number);
  });
};

const sendMessage = async (id: number, req: string) => {
  await bot.api.sendMessage(id, req);
};

app.post("/sendMessages", async (req, res) => {
  try {
    isSent = true;
    const userIDs = await fetchAllUsers(); // Call fetchAllUsers to get the array of user IDs
    for (let i = 0; i < userIDs.length; i++) {
      await sendMessage(userIDs[i], req.body.data); // Iterate over the user IDs and send messages
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error handling request:", error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("Server started");
});

bot.start();
