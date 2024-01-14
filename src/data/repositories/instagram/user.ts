import { IgApiClient } from 'instagram-private-api';
import { InstagramUser, Story } from '../../../models';

export interface InstagramUserRepository {
	lookup(username: string): Promise<InstagramUser>;
	stories(id: number): Promise<Story[]>;
}

export class FakeInstagramUserRepository implements InstagramUserRepository {
	lookup(username: string): Promise<InstagramUser> {
		return Promise.resolve({
			userId: 0,
			username: username
		});
	}

	stories(id: number): Promise<Story[]> {
		return Promise.resolve([
			{
				url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
				isVideo: true,
				publishedDate: new Date()
			},
			{
				url: 'https://download.pexels.com/vimeo/474243696/pexels-artem-podrez-5752729.mp4?width=3840',
				isVideo: true,
				publishedDate: new Date()
			},
			{
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
		const info = await this.client.user.usernameinfo(username);

		return <InstagramUser>{
			userId: info.pk,
			username: username
		};
	}

	async stories(id: number): Promise<Story[]> {
		const stories = await this.client.feed
			.reelsMedia({ userIds: [id] })
			.items();

		return stories.map(function (item) {
			const isVideo = item.video_duration > 0;

			return <Story>{
				isVideo: isVideo,
				url: isVideo
					? item.video_versions[0].url
					: item.image_versions2.candidates[0].url,
				publishedDate: new Date(item.taken_at)
			};
		});
	}
}
