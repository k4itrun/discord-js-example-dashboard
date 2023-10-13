const {CLIENT:{MONGO_URL}} = require(`${process.cwd()}/src/JSON/settings.json`);
const colors = require("colors");
const Josh = require('@joshdb/core');
const JoshMongo = require('@joshdb/mongo');

module.exports = async (client) => {
    return new Promise(async (res) => {
        client.logger("Now loading the Database ...")
        client.database = {}
        // when the db is ready
        client.database.settings = new Josh({
            name: "settings",
            provider: JoshMongo,
            providerOptions: {
              url: MONGO_URL,
              collection: "settings",
              dbName: "k4itrun_handler"
            },
        });
        client.database.settings.defer.then( async () => {
            client.logger("Database connected!")
        });
    })
}