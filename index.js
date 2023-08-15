"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const prisma_1 = require("./prisma/prisma");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
let data;
let isSent = false;
const bot = new grammy_1.Bot(process.env.BOT_TOKEN);
bot.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(ctx.chat);
    if (ctx.chat.type === "private") {
        const user = yield prisma_1.prisma.user.findUnique({
            where: { id: ctx.chat.id }, // No need for conversion
        });
        if (!user) {
            yield prisma_1.prisma.user.create({
                data: {
                    id: ctx.chat.id,
                    first_name: ctx.chat.first_name,
                },
            });
        }
        if (isSent) {
            ctx.reply(`Hello ${data.first_name}`);
        }
        else {
            ctx.reply("Hello!");
        }
    }
    else {
        // Handle group chats or other chat types
        ctx.reply("Hello!");
    }
}));
const fetchAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.findMany().then((users) => {
        return users.map((data) => data.id);
    });
});
const sendMessage = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.api.sendMessage(id, req);
});
app.post("/sendMessages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        isSent = true;
        const userIDs = yield fetchAllUsers(); // Call fetchAllUsers to get the array of user IDs
        for (let i = 0; i < userIDs.length; i++) {
            yield sendMessage(userIDs[i], req.body.data); // Iterate over the user IDs and send messages
        }
        res.sendStatus(200);
    }
    catch (error) {
        console.error("Error handling request:", error);
        res.sendStatus(500);
    }
}));
app.listen(3000, () => {
    console.log("Server started");
});
bot.start();
