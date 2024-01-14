import { Telegraf } from "telegraf";
import { GlobalTracker } from "../models";
import { handleInstagramAuthentication, handleStoryActivityTracking } from "./handle";
import { Vault } from "@web-pacotes/vault";
import { Config } from "../config";
import { InstagramAuthenticationRepository, InstagramUserRepository } from "../data";

export function scheduleActivityTracking(
    bot: Telegraf,
    config: Config,
    vault: Vault,
) {
    const tracker = vault.lookup<GlobalTracker>('GlobalTracker')!;
    const userRepository = vault.lookup<InstagramUserRepository>('InstagramUserRepository')!;

    setInterval(
        () => handleStoryActivityTracking(bot.telegram, tracker, userRepository,),
        config.trackingIntervalMS,
    );
}

export function scheduleAuthentication(
    config: Config,
    vault: Vault,
) {
    const authenticationRepository = vault.lookup<InstagramAuthenticationRepository>('InstagramAuthenticationRepository')!;

    handleInstagramAuthentication(config, authenticationRepository);
    setInterval(
        () => handleInstagramAuthentication(config, authenticationRepository),
        60 * 60 * 1000,
    );
}