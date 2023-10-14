const Discord = require("discord.js");
const { promises } = require('fs');
const { resolve } = require("path");

/**
 * This JavaScript function loads and binds event handlers for a Discord bot.
 * @param path - The `path` parameter is the directory path where the events are located. In this code,
 * it is set to `${process.cwd()}/src/events`, which means it is looking for events in the `src/events`
 * directory relative to the current working directory.
 * @param [recursive=true] - The `recursive` parameter is a boolean value that determines whether the
 * function should recursively search for files in subdirectories. If `recursive` is set to `true`, the
 * function will search for files in all subdirectories of the given `path`. If `recursive` is set to
 * `false`, the
 * @returns The code is returning a boolean value of `true`.
 */
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
