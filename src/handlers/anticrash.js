/* The code exports a function that sets up event listeners for unhandled rejections, uncaught
exceptions, and warnings in a Node.js application. */
module.exports = () => {
  try {
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
    process.on("warning", (err, origin) => {
      console.log('\n\n\n\n\n\n=== uncaught Wirning ==='.toUpperCase().yellow.dim);
      console.log('Warning: ', err.stack ? err.stack : err)
      console.log('=== uncaught Warning ===\n\n\n\n\n'.toUpperCase().yellow.dim);
    })
  } catch (e) {
    console.log(e);
  }
  return true; 
}