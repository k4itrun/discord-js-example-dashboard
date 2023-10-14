const DASHBOARD = require(`${process.cwd()}/src/JSON/settings.json`);
const CONFIG = require(`${process.cwd()}/src/JSON/settings.json`);
const Discord = require("discord.js");
/**
 * This JavaScript function handles commands and responses for a Discord bot, including checking the
 * command prefix, parsing arguments, and executing specific commands.
 * @param str - The `str` parameter is a string that needs to be escaped. It is used in the
 * `escapeRegex` function to escape special characters in the string.
 * @returns The code is returning different responses based on the command provided by the user. If the
 * command is "prefix", it will reply with the current prefix and a message to go to the dashboard to
 * change it. If the command is "hi", it will reply with the message stored in the `MESSAGE_BOT`
 * variable.
 */

module.exports = async (client, message) => {
  if (!message.guild || message.author.bot || message.guild.available === false || !message.channel || message.webhookId) return

  client.settings.ensure(message.guild.id, {
    PREFIX: CONFIG.CLIENT.PREFIX,
    MESSAGE_BOT: "Hola como estas :)",
  });

  const GuildSettings = await client.settings.get(message.guild.id);
  
  const { PREFIX, MESSAGE_BOT } = GuildSettings;
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  
  if (!prefixRegex.test(message.content)) return;
  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) {
    if(matchedPrefix.includes(client.user.id))
    return message.channel.send({embeds: [new Discord.EmbedBuilder()
        .setColor("White")
        .setTitle(`Hugh? I got pinged? Imma give you some help`)
        .setDescription(`To see all Commands type: \`${PREFIX}help\``)
      ]
    });
    return;
  }

  if (cmd.length > 0 && message.content.startsWith(PREFIX)) {
    if (cmd === "prefix") {
      message.reply(
        `¡El prefijo actual es \`${PREFIX}\`!\n**¡Ve al panel para cambiarlo!**\n> ${
          DASHBOARD.WWW.SITE.HOST
        }`
      ).catch(console.error);
    }
    if (cmd === "hi") {
      message.reply(MESSAGE_BOT).catch(console.error);
    }
  }
};

function escapeRegex(str) {
  try {
    if (str === null) {
      return "";
    }
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}
