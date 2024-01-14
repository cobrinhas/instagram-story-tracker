import { BotContext } from '../core';
import { Message } from 'telegraf/typings/core/types/typegram';
import {
	renderTrackingActivityStartMessage,
	renderUserNotFoundMessage
} from '../templates';
import { logError } from '@web-pacotes/lumberdash';

export default async function (context: BotContext) {
	const { message } = context;

	if (isTextMessage(message) && message.text.startsWith('@')) {
		return handleTrackUserStoryActivityMessage(context, message);
	}
}

async function handleTrackUserStoryActivityMessage(
	context: BotContext,
	message: Message.TextMessage
) {
	const { chatID, tracker, userRepository } = context;

	try {
		const username = message.text.substring(1);
		const user = await userRepository.lookup(username);

		const trackRecord = tracker[chatID] ?? {
			requesterChat: chatID,
			trackedStories: [],
			trackingUser: user
		};

		context.reply(renderTrackingActivityStartMessage(user.username), {
			parse_mode: 'Markdown'
		});

		tracker[chatID] = trackRecord;
	} catch (error) {
		context.reply(renderUserNotFoundMessage());

		logError(new Error(`${error}`));
	}
}

function isTextMessage(
	message: Message | undefined
): message is Message.TextMessage {
	return message !== undefined && 'text' in message;
}
