//info.mjs

export async function handleInfo(message) {
  // Placeholder – will pull memory summary from Notion later
  return message.reply(`📌 You're in: **${message.channel.name}**\nUser: <@${message.author.id}>`);
}
