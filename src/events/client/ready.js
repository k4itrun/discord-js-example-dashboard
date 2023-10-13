const CONFIG = require(`${process.cwd()}/src/JSON/settings.json`);
const { ActivityType } = require('discord.js');
const moment = require("moment")
module.exports = async (client) => {
    console.log("READY BOT")
    // CHANGE_STATUS(client);
    // setInterval(()=>{
    //   CHANGE_STATUS(client);
    // }, 15e3);
}
/* var state = false;
async function CHANGE_STATUS(client){
  if(!state){
    for(id of client.cluster.ids.map(s => s.id)){
        client.user.setPresence({
            activities: [{ name: `${CONFIG.CLIENT.STATUS.TEXT_2}`
            .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
            .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
            .replace("{name}", client.user.username)
            .replace("{tag}", client.user.tag)
            , type: ActivityType[CONFIG.CLIENT.STATUS.ACTIVITY_2] }],
            status: CONFIG.CLIENT.STATUS.STATUS,
          });
    }
  } else {
    for(id of client.cluster.ids.map(s => s.id)){
        client.user.setPresence({
            activities: [{ name: `${CONFIG.CLIENT.STATUS.TEXT_1}`
            .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
            .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
            .replace("{name}", client.user.username)
            .replace("{tag}", client.user.tag)
            , type: ActivityType[CONFIG.CLIENT.STATUS.ACTIVITY_1] }],
            status: CONFIG.CLIENT.STATUS.STATUS,
          });
    }
    
  }
  state = !state;
}
*/