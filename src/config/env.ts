import { config as loadEnv } from 'dotenv';
import { Config } from './config';

export function load(): Config {
	loadEnv();

	return <Config>(<unknown>{
		...process.env
	});
}
