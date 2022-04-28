import { Client } from "discord.js";
import Commands from "../commands";

export default (client: Client) => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }
    await client.application.commands.set(Commands);
    console.log("client.application.commands", client.application.commands);

    console.log(`Logged in as ${client.user.tag}!, ${client.user.username}`);
  });
};
