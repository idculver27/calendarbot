const { token } = require("../config.json");

const guildID = "1224530443198791750"; // replace with your server's ID
const clientID = "1228831445519306763";

const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
    {
        name: "register",
        description: "Register your Gmail address so Cal can send you Google Calendar invites",
        options: [
            {
                name: "gmail-address",
                description: "Your Gmail address",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "unregister",
        description: "Unregister your Gmail address with Cal",
        options: [
            {
                name: "gmail-address",
                description: "Your Gmail address",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    }
];

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("Deploying slash commands...");

        await rest.put(
            Routes.applicationGuildCommands(clientID, guildID),
            { body: commands }
        )

        console.log("Sucessfully deployed slash commands");
    } catch (e) {
        console.log(e);
    }
})();