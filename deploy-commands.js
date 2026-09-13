require("dotenv").config();

const {
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("setup-downloads")
    .setDescription("Create the TRON-Code download panel")
    .toJSON()
];

const rest = new REST({ version: "10" })
  .setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Registering TRON commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("✅ Commands registered!");
  } catch (error) {
    console.error(error);
  }
})();