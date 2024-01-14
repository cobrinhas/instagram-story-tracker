import { logMessage } from '@web-pacotes/lumberdash';
import { BotContext } from '../core';
import { renderGoodbyeMessage } from '../templates';

export default async function (context: BotContext) {
	const { chatID, tracker } = context;
	logMessage(`user (${chatID}) quit bot`);

	delete tracker[chatID];

	return context.reply(renderGoodbyeMessage());
}
