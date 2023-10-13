const { CLIENT:{ MONGO_URL, PREFIX } } = require(`${process.cwd()}/src/JSON/settings.json`);
const { Database } = require("quickmongo");

module.exports = async (client) => {
  return new Promise(async (resolve) => {
    try {
      const connectionOptions = {
        useUnifiedTopology: true,
        maxPoolSize: 100,
        minPoolSize: 50,
        writeConcern: "majority",
      };

      process.env.DB_cache_ping = 10_000; // Eliminar la caché después de X ms | < 0 === nunca eliminar [DEFAULT: 60_000]
      process.env.DB_cache_get = 0; // Eliminar la caché después de X ms | < 0 === nunca eliminar [DEFAULT: 300_000]
      process.env.DB_cache_all = 0; // Eliminar la caché después de X ms | < 0 === nunca eliminar [DEFAULT: 600_000]

      client.database = new Database(MONGO_URL, connectionOptions);

      client.database.on("ready", async () => {
        let dateNow = Date.now();
        let space = "       ";
        const DbPing = await client.database.ping();
        console.log(`${space}DB Loaded: LOADED THE DATABASE after: ${Date.now() - dateNow}ms`.brightGreen);
        console.log(`${space}DB Loaded: Database got a ${DbPing}ms ping\n\n`.green);

        client.settings = new client.database.table("settings");
      
        resolve(true);
      });

      const retryOnFailure = async (event, message) => {
        let retryCount = 0;
        client.database.on(event, async () => {
          console.log(`DB ${message}`.bgRed);
          retryCount++;
          if (retryCount === 5) {
            console.log(`DB Loaded: Can't reconnect, it's above the retry limit`.bgRed);
            return;
          }
          await delay(2_000);
          await client.database.connect();
        });
      };

      retryOnFailure("error", "ERRORED");
      retryOnFailure("close", "CLOSED");
      retryOnFailure("disconnected", "DISCONNECTED");

      try {
        client.logger("DB Loaded: Now loading the Database ...");
      } catch (e) {
        console.log(String(e.stack).bgRed);
      }

      try {
        const isConnected = await client.database.connect();
        if (isConnected) {
          client.logger("DB Loaded: Database connected!");
        } else {
          console.log("DB Loaded: Error connecting to the database!");
        }
      } catch (e) {
        console.log(String(e.stack).bgRed);
      }
    } catch (error) {
      console.log(String(error.stack).bgRed);
    }
  });
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
