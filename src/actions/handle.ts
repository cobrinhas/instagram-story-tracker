import { Telegram } from 'telegraf';
import { GlobalTracker, InstagramCredentials } from '../models';
import {
	InstagramAuthenticationRepository,
	InstagramUserRepository
} from '../data';
import { logError, logMessage } from '@web-pacotes/lumberdash';
import {
	renderFoundNewStoryActivityMessage,
	renderStoryAlertCaption
} from '../bot/templates';
import { Config } from '../config';

export async function handleStoryActivityTracking(
	telegram: Telegram,
	tracker: GlobalTracker,
	userRepository: InstagramUserRepository
) {
	const records = Object.entries(tracker);

	logMessage(
		`story activity tracking started... ${records.length} records to go through`
	);

	for (const [chatID, trackRecord] of records) {
		const previousTrackedStories = trackRecord.trackedStories;
		const fetchedStories = await userRepository.stories(
			trackRecord.trackingUser.userId
		);

		const storiesLeftToAnnounce = fetchedStories.filter(
			(ft) => previousTrackedStories.find((st) => ft.id == st.id) === undefined
		);
		trackRecord.trackedStories.push(...storiesLeftToAnnounce);

		logMessage(
			`found ${storiesLeftToAnnounce.length} left to announce for user: ${chatID}`
		);

		if (storiesLeftToAnnounce.length > 0) {
			await telegram.sendMessage(
				chatID,
				renderFoundNewStoryActivityMessage(trackRecord.trackingUser.username),
				{ parse_mode: 'Markdown' }
			);
		}

		for (const story of storiesLeftToAnnounce) {
			if (story.isVideo) {
				telegram.sendVideo(chatID, story.url, {
					caption: renderStoryAlertCaption(story)
				});
			} else {
				telegram.sendPhoto(chatID, story.url, {
					caption: renderStoryAlertCaption(story)
				});
			}
		}
	}
}

export function handleInstagramAuthentication(
	config: Config,
	authenticationRepository: InstagramAuthenticationRepository
) {
	authenticationRepository
		.authenticate(<InstagramCredentials>{
			username: config.username,
			password: config.password
		})
		.then(() => logMessage(`authentication successful: ${config.username}`))
		.catch((error) => logError(error));
}
