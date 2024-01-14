import { Context } from "telegraf";
import { ChatID, GlobalTracker } from "../../models";
import { InstagramAuthenticationRepository, InstagramUserRepository } from "../../data";
import { Vault } from "@web-pacotes/vault";

export type BotContext = Context & {
    chatID: ChatID,
    chatUserName: string,
    tracker: GlobalTracker,
    authenticationRepository: InstagramAuthenticationRepository,
    userRepository: InstagramUserRepository,
}

export function botContext(
    context: Context,
    vault: Vault,
): BotContext {
    const canTransform = context.chat && context.message;

    if (!canTransform) {
        throw 'invalid state'
    }

    return Object.assign(
        context,
        {
            chatID: context.chat.id,
            chatUserName: context.message.from.first_name,
            tracker: vault.lookup<GlobalTracker>('GlobalTracker')!,
            authenticationRepository: vault.lookup<InstagramAuthenticationRepository>('InstagramAuthenticationRepository')!,
            userRepository: vault.lookup<InstagramUserRepository>('InstagramUserRepository')!
        }
    );
}