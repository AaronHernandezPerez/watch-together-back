import "dotenv/config";
import { Client } from "discord.js";
import WOKCommands from "wokcommands";

const serverIds = ["455149192952676353", "198486696818507776"];

// TODO: https://sabe.io/tutorials/how-to-build-discord-bot-typescript
// Use recommended partials for the built-in help menu
const client = new Client({
  partials: ["MESSAGE", "REACTION"],
  intents: [],
});

client.on("ready", () => {
  new WOKCommands(client, {
    // The name of the local folder for your command files
    commandsDir: "commands",
    testServers: serverIds,
  }).setCategorySettings([
    {
      name: "Watch together",
      emoji: "🥵",
    },
    {
      name: "Fun & Games",
      emoji: "🎮",
    },
  ]);
});

console.log("env", process.env)
console.log("token", process.env.DISCORD_TOKEN)

client
  .login(process.env.DISCORD_TOKEN)
  .then((data) => {
    console.log("Connected to Discord", data);
  })
  .catch((e) => {
    console.error("Discord login error", e);
  });
