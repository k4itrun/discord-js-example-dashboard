module.exports = async (client, event, id) => {
    client.logger.warn(`Shard \`#${id}\` was disconnected!`)
}