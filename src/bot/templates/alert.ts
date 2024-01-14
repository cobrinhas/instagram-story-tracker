import { Story } from "../../models";

export function renderFoundNewStoryActivityMessage(username: string): string {
    return `
New story activity detected for user \`@${username}\`
    `;
}

export function renderStoryAlertCaption(story: Story): string {
    return `
Story was published on: ${story.publishedDate.toLocaleTimeString()}
    `;
}