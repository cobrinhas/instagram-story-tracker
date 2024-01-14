import { IgApiClient } from 'instagram-private-api';
import { InstagramUser, Story } from '../../../models';
import { logError, logMessage } from '@web-pacotes/lumberdash';

export interface InstagramUserRepository {
	lookup(username: string): Promise<InstagramUser>;
	stories(id: number): Promise<Story[]>;
}

export class FakeInstagramUserRepository implements InstagramUserRepository {
	lookup(username: string): Promise<InstagramUser> {
		logMessage(`hitting fake lookup endpoint for user: ${username}`);

		return Promise.resolve({
			userId: 0,
			username: username
		});
	}

	stories(id: number): Promise<Story[]> {
		logMessage(`hitting fake stories endpoint for user: ${id}`);

		return Promise.resolve([
			{
				id: '0',
				url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
				isVideo: true,
				publishedDate: new Date()
			},
			{
				id: '1',
				url: 'https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg',
				isVideo: false,
				publishedDate: new Date()
			}
		]);
	}
}

export class PrivateApiInstagramUserRepository
	implements InstagramUserRepository
{
	private client: IgApiClient;

	constructor(client: IgApiClient) {
		this.client = client;
	}

	async lookup(username: string): Promise<InstagramUser> {
		logMessage(`looking up user: ${username} on Private API`);

		const info = await this.client.user.usernameinfo(username);

		return <InstagramUser>{
			userId: info.pk,
			username: username
		};
	}

	async stories(id: number): Promise<Story[]> {
		logMessage(`fetching latested stories on Private API for user: ${id}`);

		try {
			const stories = await this.client.feed
				.reelsMedia({ userIds: [id] })
				.items();

			return stories.map(function (item) {
				const isVideo = item.video_duration > 0;

				return <Story>{
					id: item.pk,
					isVideo: isVideo,
					url: isVideo
						? item.video_versions[0].url
						: item.image_versions2.candidates[0].url,
					publishedDate: new Date(item.taken_at * 1000)
				};
			});
		} catch (error) {
			logError(new Error(`${error}`));

			return [];
		}
	}
}
