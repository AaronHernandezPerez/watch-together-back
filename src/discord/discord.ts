import "dotenv/config";
import { Client } from "discord.js";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
const client = new Client({
  intents: [],
});

ready(client);
interactionCreate(client);

client.login(process.env.DISCORD_TOKEN);
