import { runGhostDiagnostics } from '../assistants/ghost.mjs';
export async function handleGhostFix(message) {
  const response = await runGhostDiagnostics({
    userId: message.author.id,
    channelId: message.channel.id
  });
  await message.reply(response);
}
