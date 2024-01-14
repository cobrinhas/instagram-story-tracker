import { load } from './config';
import { initialize } from './bot';
import { Vault } from '@web-pacotes/vault';
import { GlobalTracker } from './models';
import {
	FakeInstagramAuthenticationRepository,
	FakeInstagramUserRepository,
	PrivateApiInstagramAuthenticationRepository,
	PrivateApiInstagramUserRepository
} from './data';
import {
	EmojiLumberdashClient,
	putLumberdashToWork
} from '@web-pacotes/lumberdash';
import { IgApiClient } from 'instagram-private-api';

putLumberdashToWork([new EmojiLumberdashClient()]);

const config = load();
const vault = createVault(false);

const bot = initialize(config.bot_token, vault);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch();

function createVault(debugMode: boolean): Vault {
	const vault = new Vault();
	const client = new IgApiClient();

	vault.store(<GlobalTracker>{}, 'GlobalTracker');
	vault.store(client, 'IgApiClient');

	if (debugMode) {
		vault.store(
			new FakeInstagramAuthenticationRepository(),
			'InstagramAuthenticationRepository'
		);
		vault.store(new FakeInstagramUserRepository(), 'InstagramUserRepository');
	} else {
		vault.store(
			new PrivateApiInstagramAuthenticationRepository(client),
			'InstagramAuthenticationRepository'
		);
		vault.store(
			new PrivateApiInstagramUserRepository(client),
			'InstagramUserRepository'
		);
	}

	return vault;
}
