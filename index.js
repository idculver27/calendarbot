const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents
    ]
});

client.on("ready", (c) => {
    console.log(c.user.tag + " is ready");
});

client.on("messageCreate", (msg) => {
    if(msg.author.bot) return
    
    console.log(msg);
    msg.channel.send("hello world");
});

client.login(token);