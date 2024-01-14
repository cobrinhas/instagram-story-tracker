
import { load } from './config';
import { initialize } from './bot';
import { Vault } from '@web-pacotes/vault';
import { GlobalTracker } from './models';
import { FakeInstagramAuthenticationRepository, FakeInstagramUserRepository } from './data';

const config = load();
const vault = createVault();

const bot = initialize(config.bot_token, vault);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch();

function createVault(): Vault {
    const vault = new Vault();

    vault.store(<GlobalTracker>{}, 'GlobalTracker');
    vault.store(new FakeInstagramAuthenticationRepository(), 'InstagramAuthenticationRepository');
    vault.store(new FakeInstagramUserRepository(), 'InstagramUserRepository');

    return vault;
}