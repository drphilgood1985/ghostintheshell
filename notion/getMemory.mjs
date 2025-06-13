//getMemory.mjs

import { notion, databaseId } from './notionClient.mjs';

export async function getMemory({ userId, channelId, limit = 10 }) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          { property: 'UserID', rich_text: { equals: userId } },
          { property: 'ChannelID', rich_text: { equals: channelId } }
        ]
      },
      sorts: [{ property: 'Timestamp', direction: 'descending' }]
    });

    const messages = response.results.slice(0, limit).map(page => {
      const role = page.properties.Role.select.name;
      const contentBlock = page.properties?.content?.rich_text?.[0]?.plain_text ?? '';
      return { role, content: contentBlock };
    });

    return messages.reverse(); // chronological order
  } catch (err) {
    console.error(`❌ Notion memory fetch failed: ${err.message}`);
    return [];
  }
}
