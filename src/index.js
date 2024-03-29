/**
 * This code is still incomplete, I haven't finished it yet due to lack -
 * of time, I have no idea when I will see it again, but I know I will -
 * make improvements and solve what is missing (you can contribute by making a pull request).
 */

/* The code is importing various modules and assigning them to constants. */
const CONFIG = require(`${process.cwd()}/src/JSON/settings.json`);
const { ClusterClient, getInfo } = require('discord-hybrid-sharding');
const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');

/* The code `require("colors")` is importing the `colors` module, which provides additional color
formatting options for console output. This allows you to add colors to your console logs. */
require("colors");
require("dotenv").config();

/* The code is creating a new instance of the `Client` class from the `discord.js` library. The
`Client` class represents a Discord bot client. */
const client = new Client({
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false,
  },
  partials: [
    Partials.Message, // for message
    Partials.Channel, // for text channel
    Partials.GuildMember, // for guild member
    Partials.Reaction, // for message reaction
    Partials.GuildScheduledEvent, // for guild events
    Partials.User, // for discord user
    Partials.ThreadMember, // for thread member
  ],
  intents: [
    GatewayIntentBits.Guilds, // for guild related things
    GatewayIntentBits.GuildMembers, // for guild members related things
    GatewayIntentBits.GuildBans, // for manage guild bans
    GatewayIntentBits.GuildEmojisAndStickers, // for manage emojis and stickers
    GatewayIntentBits.GuildIntegrations, // for discord Integrations
    GatewayIntentBits.GuildWebhooks, // for discord webhooks
    GatewayIntentBits.GuildInvites, // for guild invite managing
    GatewayIntentBits.GuildVoiceStates, // for voice related things
    GatewayIntentBits.GuildPresences, // for user presence things
    GatewayIntentBits.GuildMessages, // for guild messages things
    GatewayIntentBits.GuildMessageReactions, // for message reactions things
    //GatewayIntentBits.GuildMessageTyping, // for message typing things
    GatewayIntentBits.DirectMessages, // for dm messages
    GatewayIntentBits.DirectMessageReactions, // for dm message reaction
    //GatewayIntentBits.DirectMessageTyping, // for dm message typinh
    GatewayIntentBits.MessageContent, // enable if you need message content things
  ],
  presence: {
    activities: [{ name: `HI...`, type: ActivityType.Custom }],
    status: "dnd"
  },
  //shards: Cluster.data.SHARD_LIST, // An Array of Shard list, which will get spawned
  //shardCount: Cluster.data.TOTAL_SHARDS, // The Number of Total Shards
});

/* The `client.logger` function is a custom logging function that is being added to the `client`
object. It takes in a parameter `data`, which can be of type string, object, boolean, or any other
type. */
client.logger = (data) => {
  try {
    let logstring = `${"[x] ::".magenta}`;
    if (typeof data === "string") {
      console.log(logstring, data.split("\n").map(d => `${d}`.green).join(`\n${logstring} `));
    } else if (typeof data === "object") {
      console.log(logstring, JSON.stringify(data, null, 3).green);
    } else if (typeof data === "boolean") {
      console.log(logstring, String(data).cyan);
    } else {
      console.log(logstring, data);
    }
  } catch (e) {
    console.log(e);
  }
};

/**
 * The function `requirehandlers` asynchronously loads and executes a series of handler modules in a
 * specific order.
 */
async function requirehandlers() {
  // resolve promise
  /*for await (const handler of [
    "xxx"
  ]) {
    try{
      await require(`./src/handlers/${handler}`)(client);
    } catch (e){ console.log(String(e.stack).bgRed) }
  }*/
  // handlers
  [
    "anticrash",
    "db",
    "events",
    "vars"
  ].forEach(handler => {
    try {
      require(`${process.cwd()}/src/handlers/${handler}`)(client);
    } catch (e) { console.log(String(e.stack).bgRed) }
  });
}
requirehandlers();

//client.cluster = new ClusterClient(client);

/* The code `client.on("ready", () => { require(`${process.cwd()}/src/dashboard/index.js`)(client); })`
is registering an event listener for the "ready" event of the Discord client. */
client.on("ready", () => {
  require(`${process.cwd()}/src/dashboard/index.js`)(client);
})

/* `client.login(process.env.TOKEN || CONFIG.CLIENT.TOKEN)` is logging the client into Discord using
the bot token. */
client.login(process.env.TOKEN || CONFIG.CLIENT.TOKEN)