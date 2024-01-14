import { renderWelcomeMessage } from '../templates';
import { logMessage } from '@web-pacotes/lumberdash';
import { BotContext } from '../core';

export default async function (context: BotContext) {
	const { chatID } = context;
	logMessage(`a new user (${chatID}) started interaction with bot`);

	return context.reply(
		renderWelcomeMessage()
	);
}
