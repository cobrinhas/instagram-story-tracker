import { IgApiClient } from 'instagram-private-api';
import { InstagramCredentials } from '../../../models';

export interface InstagramAuthenticationRepository {
	authenticate(credentials: InstagramCredentials): Promise<void>;
}

export class FakeInstagramAuthenticationRepository
	implements InstagramAuthenticationRepository
{
	authenticate(credentials: InstagramCredentials): Promise<void> {
		return Promise.resolve();
	}
}

export class PrivateApiInstagramAuthenticationRepository
	implements InstagramAuthenticationRepository
{
	private client: IgApiClient;

	constructor(client: IgApiClient) {
		this.client = client;
	}

	async authenticate(credentials: InstagramCredentials): Promise<void> {
		this.client.state.generateDevice(credentials.username);

		await this.client.account.login(credentials.username, credentials.password);
	}
}
