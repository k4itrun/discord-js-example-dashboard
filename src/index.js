
const Discord = require("discord.js");
const CONFIG = require(`${process.cwd()}/src/JSON/settings.json`);
const colors = require("colors");

const client = new Discord.Client({
    shards: "auto",
    allowedMentions: { parse: [ ], repliedUser: false, },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [ Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, ]
});


/**********************************************************
 * Iniciar dashboard
 *********************************************************/
client.on("ready", () => {
    require(`${process.cwd()}/src/dashboard/index.js`)(client);
})

/**********************************************************
 * Iniciar bot
 *********************************************************/
client.login(process.env.TOKEN || CONFIG.CLIENT.TOKEN)