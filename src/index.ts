import { load } from './config';
import { initializeBot } from './bot';
import {
	EmojiLumberdashClient,
	putLumberdashToWork
} from '@web-pacotes/lumberdash';
import { scheduleActivityTracking, scheduleAuthentication } from './actions';
import { createVault } from './vault';

putLumberdashToWork([new EmojiLumberdashClient()]);

const config = load();
const vault = createVault(config.release);
const bot = initializeBot(config.botToken, vault);

process.nextTick(() => scheduleAuthentication(config, vault));
process.nextTick(() => scheduleActivityTracking(bot, config, vault));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch();
