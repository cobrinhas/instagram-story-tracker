import { IgApiClient } from 'instagram-private-api';
import { Telegraf } from 'telegraf';
import { config as dotenv } from 'dotenv';
import { Message } from 'telegraf/typings/core/types/typegram';

type Config = {
	username: string;
	password: string;
	bot_token: string;
};

type ChatID = number;
type InstagramUserID = number;

type Tracker = Record<ChatID, Array<InstagramUserID>>;

dotenv();
const config = <Config>{ ...process.env };

const tracker = <Tracker>{};

const ig = new IgApiClient();

(async () => {
	ig.state.generateDevice(config.username);
	const auth = await ig.account.login(config.username, config.password);
})();

const bot = new Telegraf(config.bot_token);

bot.command('track', (ctx) => {
	ctx.reply(
		`Hi ${ctx.state.role}! It looks like it's your first time interacting with me. To track a user story activity, just message me anytime the username starting with @.\nExample: \`@ronaldo\` `
	);

	tracker[ctx.message.chat.id] = [];
});

bot.command('quit', async (ctx) => {
	delete tracker[ctx.message.chat.id];

	// Explicit usage
	await ctx.telegram.leaveChat(ctx.message.chat.id);

	// Using context shortcut
	await ctx.leaveChat();
});

bot.command('start', async (ctx) => {
	ctx.reply(
		"Hi! Looks like you new here. Welcome!\n I'm a robot that can assist you in tracking an Instagram account story activity."
	);
	ctx.reply(
		'Go ahead and type "/" in the chat to know which commands you can instruct me on.'
	);
});

bot.on('message', async (ctx) => {
	const chatId = ctx.message.chat.id;
	const tracking = tracker[chatId] ?? [];
	const message = (ctx.message as Message.TextMessage).text;

	if (message.startsWith('@')) {
		try {
			const username = message.substring(1);
			const pk = await ig.user.getIdByUsername(username);

			ctx.reply(`Gotcha. Now tracking activity for user: \`${message}\``);
			tracking.push(pk);

			tracker[chatId] = pk;
		} catch (error) {
			console.error(error);
			ctx.reply(`It seems that no user goes by that username.`);
		}
	}
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

setInterval(async function () {
	const userIds = new Set(Object.values(tracker).flat());

	const feed = await ig.feed
		.reelsMedia({
			userIds: [...userIds]
		})
		.items();

	console.log(feed);

	feed.forEach(function (item) {
		if (item.video_versions.length > 0) {
			const url = item.video_versions[0].url;
			const chatId = Object.keys(tracker).at(0)!;

			console.log('ey');

			bot.telegram.sendVideo(chatId, url);
		}
	});
}, 20 * 1000);

bot.launch();
