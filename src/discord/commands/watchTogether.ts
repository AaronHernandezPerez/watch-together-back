import axios from "axios";
import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../command";

import { backUrl, frontUrl } from "../../utils";

const WatchTogether: Command = {
  name: "wt",
  description: "Play a video together",
  type: "CHAT_INPUT",
  options: [
    {
      name: "src",
      description: "The video to play",
      type: "STRING",
      required: true,
    },
  ],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const [{ value: src }] = interaction.options.data;
    let content: string;
    try {
      console.log("backUrl", backUrl, src);

      const { data } = await axios.post(`${backUrl}/create-room/`, { src });

      content = `${frontUrl}/room/${data.id}`;

      await interaction.followUp({
        ephemeral: true,
        content,
      });
    } catch (error) {
      content = "Error creating rooom";
      console.error(content, error);
    }

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};

export default WatchTogether;
