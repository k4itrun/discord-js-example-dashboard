module.exports = async (client, error, id) => {
    client.logger.error(`Shard \`#${id}\` got an error!`, error)
}