import { ChatID } from './chat';
import { Story } from './story';
import { InstagramUser } from './user';

export type GlobalTracker = Record<ChatID, TrackRecord>;

export interface TrackRecord {
	requesterChat: ChatID;
	trackingUser: InstagramUser;
	trackedStories: Story[];
}
