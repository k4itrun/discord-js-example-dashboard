module.exports = async (client) => {
    client.logger = (data) => {
        let logstring = `${String("[x] ::".magenta)}`
        if (typeof data == "string") {
        console.log(logstring, data.split("\n").map(d => `${d}`.green).join(`\n${logstring} `))
        } else if (typeof data == "object") {
        console.log(logstring, JSON.stringify(data, null, 3).green)
        } else if (typeof data == "boolean") {
        console.log(logstring, String(data).cyan)
        } else {
        console.log(logstring, data)
        }
    };

    process.on('unhandledRejection', (reason, p) => {
        console.log('\n\n\n\n\n=== unhandled Rejection ==='.toUpperCase().yellow.dim);
        console.log('Reason: ', reason);
        console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase().yellow.dim);
      });
      process.on("uncaughtException", (err, origin) => {
        console.log('\n\n\n\n\n\n=== uncaught Exception ==='.toUpperCase().yellow.dim);
        console.log('Exception: ', err.stack ? err.stack : err)
        console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase().yellow.dim);
      })
}