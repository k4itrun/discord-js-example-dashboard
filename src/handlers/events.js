const Discord = require("discord.js");
const { promises } = require('fs');
const { resolve } = require("path");

module.exports = async (client) => {
  try {
    const eventPaths = new Discord.Collection();
    eventPaths.clear();
    const paths = await walks(`${process.cwd()}/src/events`);
    await Promise.all(
      paths.map(async (path) => {
        const event = require(resolve(path));
        const splitted =  resolve(path).includes("\\") ? resolve(path).split("\\") : resolve(path).split("/")
        const eventName = splitted.reverse()[0].replace(".js", "");
        eventPaths.set(eventName, { eventName, path: resolve(path) });
        client.logger(`Event Loaded: ${eventName}`);
        return client.on(eventName, event.bind(null, client));
      })
    );
  } catch (e) {
    console.log(e);
  }
  return true; 
}

async function walks(path, recursive = true) {
  let files = [];
  const items = await promises.readdir(path, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      files = [ ...files, ...(await walks(`${path}/${item.name}`)) ];
    } else if (item.isFile() && item.name.endsWith('.js')) {
      files.push(`${path}/${item.name}`);
    }
  }
  return files;
};
