import { IgApiClient } from "instagram-private-api";
import { Story, UserID } from "../../../models";

export interface InstagramUserRepository {
    stories(id: UserID): Promise<Story[]>;
}

export class FakeInstagramUserRepository implements InstagramUserRepository {
    stories(id: UserID): Promise<Story[]> {
        return Promise.resolve(
            [
                {
                    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
                    isVideo: true,
                    publishedDate: new Date(),
                },
                {
                    url: 'https://download.pexels.com/vimeo/474243696/pexels-artem-podrez-5752729.mp4?width=3840',
                    isVideo: true,
                    publishedDate: new Date(),
                },
                {
                    url: 'https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg',
                    isVideo: false,
                    publishedDate: new Date(),
                }
            ]
        )
    }
}

export class PrivateApiInstagramUserRepository implements InstagramUserRepository {
    private client: IgApiClient

    constructor(
        client: IgApiClient,
    ) {
        this.client = client;
    }

    async stories(id: UserID): Promise<Story[]> {
        const stories = await this.client.feed.reelsMedia({ userIds: [id] }).items();

        return stories.map(
            function (item) {
                const isVideo = item.video_duration > 0;

                return <Story>{
                    isVideo: isVideo,
                    url: isVideo ? item.video_versions[0].url : item.image_versions2.candidates[0].url,
                    publishedDate: new Date(item.taken_at),
                };
            }
        );
    }
}