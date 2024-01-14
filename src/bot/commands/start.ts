import { Context } from "telegraf";
import { renderWelcomeMessage } from "../templates";

export default async function (context: Context) {
    return context.reply(
        renderWelcomeMessage()
    );
}