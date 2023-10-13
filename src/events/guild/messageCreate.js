const CONFIG = require(`${process.cwd()}/src/JSON/settings.json`);

module.exports =  async (client, message) => {
    if(!message.guild || message.author.bot) return;
        client.database.settings.ensure(message.guild.id, {
            PREFIX: CONFIG.PREFIX,
            MESSAGE_BOT: "Hola como estas :)",
        });
 
    let { 
        PREFIX, 
        MESSAGE_BOT
    } = client.database.settings.get(message.guild.id)
 
     let args = message.content.slice(PREFIX.length).trim().split(" ");
     let cmd = args.shift()?.toLowerCase();
 
     if(cmd && cmd.length > 0 && message.content.startsWith(PREFIX)){
             if(cmd == "prefix" || cmd == "prefijo"){
                 message.reply(
                    `¡El prefijo actual es \`${
                        PREFIX
                    }\`!\n**¡Ve al panel para cambiarlo!**\n> ${
                        DASHBOARD.WWW.SITE.HOST
                    }`).catch(console.error);
             }
             if(cmd == "hi" || cmd == "hola"){
                 message.reply(MESSAGE_BOT).catch(console.error);
             }
         }
}