import { Vault } from '@web-pacotes/vault';
import { IgApiClient } from 'instagram-private-api';
import { GlobalTracker } from './models';
import {
	FakeInstagramAuthenticationRepository,
	FakeInstagramUserRepository,
	PrivateApiInstagramAuthenticationRepository,
	PrivateApiInstagramUserRepository
} from './data';

export function createVault(releaseMode: boolean): Vault {
	const vault = new Vault();
	const client = new IgApiClient();

	vault.store(<GlobalTracker>{}, 'GlobalTracker');
	vault.store(client, 'IgApiClient');

	if (!releaseMode) {
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
