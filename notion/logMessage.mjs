//logMessage.mjs

import { notion, databaseId } from './notionClient.mjs';

export async function logMessage({ userId, channelId, role, content }) {
  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        UserID: { rich_text: [{ text: { content: userId } }] },
        ChannelID: { rich_text: [{ text: { content: channelId } }] },
        Role: { select: { name: role } }, // 'user', 'gabby', or 'jason'
        Timestamp: { date: { start: new Date().toISOString() } }
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: { rich_text: [{ text: { content } }] }
        }
      ]
    });
  } catch (err) {
    console.error(`❌ Notion log failed: ${err.message}`);
  }
}
