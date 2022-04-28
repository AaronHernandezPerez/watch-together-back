import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../command";

const Ping: Command = {
  name: "ping",
  description: "Pings the server",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const content = "pong";

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};

export default Ping;
