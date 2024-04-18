const fs = require("fs");
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("../config.json");
var registry;

// load registry
fs.readFile("registry.json", function(err, data) {
    if (err) throw err;
    registry = JSON.parse(data);
});

// create client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents
    ]
});

// ready
client.once(Events.ClientReady, readyClient => {
    console.log(`${readyClient.user.tag} is ready!`);
    // TODO: check current events when initializing
    getEvents();
});

// slash commands
client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "register") registryAdd(interaction);
    else if (interaction.commandName === "unregister") registryRemove(interaction);
});

client.on("guildScheduledEventCreate", (event) => {
    console.log("event created");
    console.log(event);

    // create google calendar event
    // data to get from event:
        // event.id
        // event.guildId
        // event.name
        // event.description
        // event.scheduledStartTimestamp (unix timestamp)
        // event.scheduledEndTimestamp (unix timestamp) (optional)
        // event.entityType (int: 2 = voice, 3 = external. used to determine which of the next 2 values is the location)
        // event.channelId
        // event.entityMetadata.location
        // event.status (int - only process events which are 1 = scheduled)
});

client.on("guildScheduledEventDelete", (event) => {
    console.log("event deleted");
    console.log(event);
});

client.on("guildScheduledEventUpdate", (event) => {
    console.log("event updated");
    console.log(event);
});

client.on("guildScheduledEventUserAdd", (event) => {
    console.log("someone clicked interested");
    console.log(event);
    // it seems like these don't work
});

client.on("guildScheduledEventUserRemove", (event) => {
    console.log("some unclicked interested");
    console.log(event);
    // it seems like these don't work
});

function registryAdd(interaction) {
    const gmailAddr = interaction.options.get("gmail-address").value;
    
    // basic validity check
    const re = /.+\@.+\..+/;
    if(!re.test(gmailAddr)) {
        interaction.reply("Hmmm...that doesn't look like an email address");
        return;
    }

    // build registry entry
    let newEntry = {
        userID: interaction.user.id,
        gmailAddr: gmailAddr
    }

    // test if entry is already in registry
    for (entry of registry) {
        if (entry.userID === newEntry.userID && entry.gmailAddr === newEntry.gmailAddr) {
            interaction.reply("You've already registered that email!");
            return;
        }
    }

    // add to registry
    registry.push(newEntry);
    registryWrite();
    interaction.reply("Successfully registered your email!");
}

function registryRemove(interaction) {
    // build registry entry to remove
    let targetEntry = {
        userID: interaction.user.id,
        gmailAddr: interaction.options.get("gmail-address").value
    }

    // find entry in registry
    for (entry of registry) {
        if (entry.userID === targetEntry.userID && entry.gmailAddr === targetEntry.gmailAddr) {
            // remove from registry
            const indexToRemove = registry.indexOf(entry);
            const firstHalf = registry.slice(0, indexToRemove);
            const secondHalf = registry.slice(indexToRemove + 1);
            registry = firstHalf.concat(secondHalf);
            registryWrite();
            interaction.reply("Successfully unregistered your email!");
            return;
        }
    }

    // no match
    interaction.reply("That email isn't registered");
}

// write to file
function registryWrite() {
    fs.writeFile(
        "registry.json",
        JSON.stringify(registry),
        err => {
            if (err) throw err;
        }
    );
}

// fetch all events
async function getEvents() {
    await fetch("http://discord.com/api/users/@me", { headers: { "Authorization": `Bot ${token}` }})
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

client.login(token);