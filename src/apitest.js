const { google } = require("googleapis");
const { token } = require("../config.json");
const { googleCreds } = require("../config.json");

async function getEvents() {
    // get all guilds
    let response = await fetch("https://discord.com/api/users/@me/guilds", { headers: { "Authorization": `Bot ${token}` } });
    const guilds = await response.json();

    // get all calendar events
    response = await fetch(".......");

    for (const guild of guilds) {
        // get all server events
        const response = await fetch(`https://discord.com/api/guilds/${guild.id}/events`, { headers: { "Authorization": `Bot ${token}` } });
        const events = await response.json();

        for (const event of events) {
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
        }
    }
}

const getGoogEvents = () => {
    calendar.events.list(
        {
            calendarId: googleCreds.calendar_id,
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: "startTime",
        },
        (error, result) => {
            if (error) {
                console.log("Something went wrong: ", error); // If there is an error, log it to the console
            } else {
                if (result.data.items.length > 0) console.log("List of upcoming events: ", result.data.items); // If there are events, print them out
                else console.log("No upcoming events found."); // If no events are found
            }
        }
    );
};

//getEvents();

// google calendar API settings
const scopes = ["https://www.googleapis.com/auth/calendar"];
const jwtClient = new google.auth.JWT(googleCreds.client_email, null, googleCreds.client_secret, scopes);
const calendar = google.calendar({
    version: "v3",
    project: googleCreds.project_id,
    auth: jwtClient
});
const auth = new google.auth.GoogleAuth({
    keyFile: "../keys.json",
    scopes: scopes
});
getGoogEvents();

// get all guilds
// for each guild, get all events
// for each event, create google calendar event with data, and find all interested users
// check if user is on the registry, then invite them to the event