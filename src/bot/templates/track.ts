import { InstagramUser } from '../../models';

export function renderFirstInteractionMessage(userName: string): string {
	return `
Hi ${userName}! It looks like it's your first time interacting with me.
To track a user story activity, just message me anytime the username starting with @.

Example: \`@ronaldo\`
    `;
}

export function renderSecondInteractionMessage(
	trackingUsers: InstagramUser[]
): string {
	return `
To track another user story activity, just message me anytime the username starting with @.
You're already tracking the following users:
${trackingUsers.map((u) => `\n\`@${u.username}\``)}
    `;
}
