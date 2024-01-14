export function renderTrackingActivityStartMessage(username: string): string {
	return `
Gotcha. Now tracking activity for user: \`@${username}\`
    `;
}

export function renderUserNotFoundMessage(): string {
	return `
It seems that no user goes by that username.
    `;
}
