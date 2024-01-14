import { BotContext } from '../core';
import {
	renderFirstInteractionMessage,
	renderSecondInteractionMessage
} from '../templates';

export default async function (context: BotContext) {
	const { chatID, chatUserName, tracker } = context;

	const trackRecord = tracker[chatID];

	if (!trackRecord) {
		context.reply(renderFirstInteractionMessage(chatUserName), {
			parse_mode: 'Markdown'
		});
	} else {
		context.reply(renderSecondInteractionMessage([trackRecord.trackingUser]), {
			parse_mode: 'Markdown'
		});
	}
}
