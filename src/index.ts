import { IgApiClient } from 'instagram-private-api';
import { config as dotenv } from 'dotenv';

type Config = {
	username: string;
	password: string;
};

dotenv();
const config = <Config>{ ...process.env };

(async () => {
	const ig = new IgApiClient();

	ig.state.generateDevice(config.username);
	const auth = await ig.account.login(config.username, config.password);

	console.log(JSON.stringify(auth));

	const targetUser = await ig.user.searchExact('ronaldo'); // getting exact user by login
	const reelsFeed = ig.feed.reelsMedia({
		// working with reels media feed (stories feed)
		userIds: [targetUser.pk] // you can specify multiple user id's, "pk" param is user id
	});

	const storyItems = await reelsFeed.items(); // getting reels, see "account-followers.feed.example.ts" if you want to know how to work with feeds

	console.log(JSON.stringify(storyItems));
})();
