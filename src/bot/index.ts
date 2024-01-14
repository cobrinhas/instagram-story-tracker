import { Telegraf } from 'telegraf';

import track from './commands/track';
import start from './commands/start';
import quit from './commands/quit';
import message from './events/message';
import { botContext } from './core';
import { Vault } from '@web-pacotes/vault';

export * from './commands';
export * from './core';
export * from './events';

export function initializeBot(token: string, vault: Vault): Telegraf {
	const bot = new Telegraf(token);

	bot.command('track', (ctx) => track(botContext(ctx, vault)));
	bot.command('start', (ctx) => start(botContext(ctx, vault)));
	bot.command('quit', (ctx) => quit(botContext(ctx, vault)));

	bot.on('message', (ctx) => message(botContext(ctx, vault)));

	return bot;
}
