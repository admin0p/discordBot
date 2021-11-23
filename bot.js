require("dotenv").config()

const {Client} = require("discord.js")
const sheet = require("./sheetopp")

const bot = new Client();
//console.log(bot.guilds.fetch())

bot.on("ready",()=>{
    console.log(bot.user.username + " logged in!!")  
})

bot.on('message',async (msg) => { 
  
    if(msg.content.split(" ")[0] === "!join"){
        const clan = msg.content.split(" ")[1]
        console.log(clan)
       const channel = msg.guild.channels.cache.find(channel => channel.name === clan);
       if(!channel){
        msg.reply("no channel exists")   
        return console.log("no channel exists")}
        //check if enable is on 
       const result = await sheet.eneblecheck(clan)
        if(!result){
            msg.reply("sorry no admissions for now ")    
            return console.log("no admissions for "+ msg.author.username)
        }//check enable on end 
        msg.reply("please check you DM for further procedure")
       msg.author.send("Enter your email id in 1 min :").then( (resMsg)=>{

            resMsg.channel.awaitMessages((newMsg) => newMsg.content,
                                        {max: 1, time: 6000, errors: ['time up bro!!']}).then(async (collected)=>{
                                           resMsg.channel.send(collected.first().content + " is your email")
                                            //check email validity 
                                            const emailstatus = await sheet.emailValidity(clan,collected.first().content)
                                                if(!emailstatus.status){
                                                    msg.author.send(emailstatus.message)    
                                                    return console.log("false status")
                                                }
                                                msg.author.send("enjoy your time in "+clan+ "  :)")
                                                channel.updateOverwrite(msg.member, {
                                                    SEND_MESSAGES: true,
                                                   VIEW_CHANNEL: true
                                            })
                                    sheet.writeTosheet(clan,collected.first().content,msg.member.guild.id,msg.member.guild.ownerID)
                                            
                                        }).catch((collected)=>{resMsg.channel.send("time's up bro !!")})
       })
       
    }
    
})

bot.login(process.env.BOT_TOKEN)