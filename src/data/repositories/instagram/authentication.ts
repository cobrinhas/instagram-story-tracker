import { IgApiClient } from 'instagram-private-api';
import { InstagramCredentials } from '../../../models';
import { logMessage } from '@web-pacotes/lumberdash';

export interface InstagramAuthenticationRepository {
	authenticate(credentials: InstagramCredentials): Promise<void>;
}

export class FakeInstagramAuthenticationRepository
	implements InstagramAuthenticationRepository
{
	authenticate(credentials: InstagramCredentials): Promise<void> {
		logMessage(`hitting fake auth endpoint with credentials: ${credentials}`);

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
		logMessage(
			`authenticating in Private API with user: ${credentials.username}`
		);

		this.client.state.generateDevice(credentials.username);

		await this.client.account.login(credentials.username, credentials.password);
	}
}
