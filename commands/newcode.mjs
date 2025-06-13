//newcode.mjs

export async function handleNewCode(message, args) {
  const channelName = args.join('-').toLowerCase().replace(/[^a-z0-9\-]/g, '');
  if (!channelName) {
    return message.reply('⚠️ Usage: `!newcode name-of-the-channel`');
  }

  const existing = message.guild.channels.cache.find(c => c.name === channelName);
  if (existing) {
    return message.reply(`📁 Channel already exists: <#${existing.id}>`);
  }

  const channel = await message.guild.channels.create({
    name: channelName,
    type: 0, // GUILD_TEXT
    topic: `Code project created by ${message.author.username}`
  });

  await channel.send(`👻 New code project started by <@${message.author.id}>.`);
  await message.reply(`✅ Created <#${channel.id}>`);
}
