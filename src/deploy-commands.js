const { token } = require("../config.json");

const guildid = "1224530443198791750";
const clientid = "1228831445519306763";

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
    }
];

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("Deploying slash commands...");

        await rest.put(
            Routes.applicationGuildCommands(clientid, guildid),
            { body: commands }
        )

        console.log("Sucessfully deployed slash commands");
    } catch (e) {
        console.log(e);
    }
})();