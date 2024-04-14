const fs = require("fs");
const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require("../config.json");
var registry;

// load registry
fs.readFile("registry.json", function(err, data) {
    if (err) throw err;
    registry = JSON.parse(data);
});

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

/*client.on("messageCreate", (msg) => {
    if(msg.author.bot) return;
    
    console.log(msg);
    msg.channel.send("hello world");
});*/

// /register
client.on("interactionCreate", (interaction) => {
    //console.log(interaction);
    
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "register") return;

    addToRegistry(interaction);
});

client.on("guildScheduledEventCreate", (event) => {
    console.log("event created");
    console.log(event);
});

client.on("guildScheduledEventDelete", (event) => {
    console.log("event deleted");
    //console.log(event);
});

client.on("guildScheduledEventUpdate", (event) => {
    console.log("event updated");
    //console.log(event);
});

client.on("guildScheduledEventUserAdd", (event) => {
    console.log("someone clicked interested?");
    //console.log(event);
});

client.on("guildScheduledEventUserRemove", (event) => {
    console.log("some unclicked interested?");
    //console.log(event);
});

client.login(token);

function addToRegistry(interaction) {
    const gmailAddr = interaction.options.get("gmail-address").value;
    
    // basic validity check
    const re = /.+\@.+\..+/;
    if(!re.test(gmailAddr)) {
        interaction.reply("Hmmm...that doesn't look like an email address");
        return;
    }

    // build registry entry
    let newEntry = {
        guildID: interaction.guildId,
        userID: interaction.user.id,
        gmailAddr: gmailAddr
    }

    // test if entry is already in registry
    for (entry of registry) {
        if (entry.guildID === newEntry.guildID && entry.userID === newEntry.userID && entry.gmailAddr === newEntry.gmailAddr) {
            interaction.reply("You've already registered that email!");
            return;
        }
    }

    // add to registry
    registry.push(newEntry);
    // write to file
    fs.writeFile(
        "registry.json",
        JSON.stringify(registry),
        err => {
            if (err) throw err;
        }
    );
    interaction.reply("Successfully registered your email!");
}

// check current events when initializing
// allow users to register - associate a gmail with the user and save to file on pi?