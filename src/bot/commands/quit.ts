import { BotContext } from '../core';
import { renderGoodbyeMessage } from '../templates';

export default async function (context: BotContext) {
	const { chatID, tracker } = context;

	delete tracker[chatID];

	return context.reply(renderGoodbyeMessage());
}
