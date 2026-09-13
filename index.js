require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField
} = require("discord.js");

const downloads = require("./downloads");

const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  console.error("❌ DISCORD_TOKEN is missing from .env");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ─────────────────────────────────────────────
// TRON CONFIG
// ─────────────────────────────────────────────

const TRON_COLOR = 0x5865f2;

// Put your banner URL here later.
const TRON_BANNER_URL =
  "https://YOUR-BANNER-URL-HERE.png";

const GITHUB_URL =
  "https://github.com/YOUR_USERNAME/TRON-Code";

// ─────────────────────────────────────────────
// READY
// ─────────────────────────────────────────────

client.once("ready", () => {
  console.log("────────────────────────────────────");
  console.log(`⚡ TRON Bot online as ${client.user.tag}`);
  console.log(`🌐 Servers: ${client.guilds.cache.size}`);
  console.log("────────────────────────────────────");

  client.user.setActivity("/help • TRON-Code");
});

// ─────────────────────────────────────────────
// INTERACTION ROUTER
// ─────────────────────────────────────────────

client.on("interactionCreate", async (interaction) => {
  try {

    if (interaction.isChatInputCommand()) {
      await handleCommand(interaction);
      return;
    }

    if (interaction.isStringSelectMenu()) {
      await handleSelectMenu(interaction);
      return;
    }

    if (interaction.isButton()) {
      await handleButton(interaction);
      return;
    }

  } catch (error) {

    console.error("❌ Interaction error:", error);

    const response = {
      content:
        "❌ Something went wrong while processing that action.",
      ephemeral: true
    };

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(response);
      } else {
        await interaction.reply(response);
      }
    } catch (replyError) {
      console.error(
        "❌ Failed to send error response:",
        replyError
      );
    }
  }
});

// ─────────────────────────────────────────────
// COMMAND HANDLER
// ─────────────────────────────────────────────

async function handleCommand(interaction) {

  switch (interaction.commandName) {

    // ───────────────────────────────────────
    // /ping
    // ───────────────────────────────────────

    case "ping": {

      const latency =
        Date.now() - interaction.createdTimestamp;

      const embed = new EmbedBuilder()
        .setTitle("🏓 TRON is online")
        .setDescription(
          "The TRON community bot is operational."
        )
        .addFields(
          {
            name: "Bot Latency",
            value: `${latency}ms`,
            inline: true
          },
          {
            name: "Discord API",
            value: `${client.ws.ping}ms`,
            inline: true
          }
        )
        .setColor(TRON_COLOR);

      await interaction.reply({
        embeds: [embed]
      });

      break;
    }

    // ───────────────────────────────────────
    // /help
    // ───────────────────────────────────────

    case "help": {

      const embed = new EmbedBuilder()
        .setTitle("⚡ TRON Bot")
        .setDescription(
          "Your gateway to the TRON-Code ecosystem."
        )
        .addFields(
          {
            name: "📦 Downloads",
            value:
              "`/setup-downloads`\nAccess TRON-Code releases and builds."
          },
          {
            name: "🏓 System",
            value:
              "`/ping`\nCheck bot and Discord API latency."
          },
          {
            name: "ℹ️ Information",
            value:
              "`/about`\nLearn more about TRON-Code."
          }
        )
        .setColor(TRON_COLOR);

      await interaction.reply({
        embeds: [embed]
      });

      break;
    }

    // ───────────────────────────────────────
    // /about
    // ───────────────────────────────────────

    case "about": {

      const githubButton = new ButtonBuilder()
        .setLabel("GitHub")
        .setEmoji("💻")
        .setStyle(ButtonStyle.Link)
        .setURL(GITHUB_URL);

      const row = new ActionRowBuilder()
        .addComponents(githubButton);

      const embed = new EmbedBuilder()
        .setTitle("⚡ TRON-Code")
        .setDescription(
          "**TRON-Code** is an open-source, model-agnostic AI coding agent built for developers."
        )
        .addFields(
          {
            name: "🤖 Agent",
            value:
              "Planning • Coding • Tools • Verification"
          },
          {
            name: "🌐 Models",
            value:
              "Cloud • OpenAI-compatible • Local"
          },
          {
            name: "🔓 Philosophy",
            value:
              "Open • Extensible • Developer-first"
          }
        )
        .setColor(TRON_COLOR);

      await interaction.reply({
        embeds: [embed],
        components: [row]
      });

      break;
    }

    // ───────────────────────────────────────
    // /setup-downloads
    // ───────────────────────────────────────

    case "setup-downloads": {

      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        await interaction.reply({
          content:
            "🔒 You need Administrator permissions to use this command.",
          ephemeral: true
        });

        return;
      }

      // ─────────────────────────────────────
      // Main banner embed
      // ─────────────────────────────────────

      const embed = new EmbedBuilder()
        .setTitle("📦 TRON-Code Downloads")
        .setDescription(
          "**Get TRON-Code and start building.**\n\n" +
          "Download the latest stable release, explore experimental builds, " +
          "or browse the source code.\n\n" +

          "🚀 **Latest Release**\n" +
          "`v0.4.1` • **Stable**\n" +
          "Recommended for most users."
        )
        .setColor(TRON_COLOR)
        .setImage(TRON_BANNER_URL)
        .setFooter({
          text:
            "TRON-Code • Open Source AI Coding Agent"
        });

      // ─────────────────────────────────────
      // Buttons
      // ─────────────────────────────────────

      const latest = downloads.latest;

      const downloadButton = new ButtonBuilder()
        .setLabel("Download Latest")
        .setEmoji("⬇️")
        .setStyle(ButtonStyle.Link)
        .setURL(latest.download);

      const githubButton = new ButtonBuilder()
        .setLabel("GitHub")
        .setEmoji("💻")
        .setStyle(ButtonStyle.Link)
        .setURL(GITHUB_URL);

      const releaseButton = new ButtonBuilder()
        .setLabel("All Releases")
        .setEmoji("📦")
        .setStyle(ButtonStyle.Link)
        .setURL(downloads.releases.github);

      const buttons = new ActionRowBuilder()
        .addComponents(
          downloadButton,
          githubButton,
          releaseButton
        );

      // ─────────────────────────────────────
      // Select menu
      // ─────────────────────────────────────

      const menu = new StringSelectMenuBuilder()
        .setCustomId("tron_downloads")
        .setPlaceholder(
          "Explore more TRON-Code resources..."
        )
        .addOptions(

          new StringSelectMenuOptionBuilder()
            .setLabel("Latest Release")
            .setDescription(
              "Download the newest stable version"
            )
            .setEmoji("🚀")
            .setValue("latest"),

          new StringSelectMenuOptionBuilder()
            .setLabel("Previous Releases")
            .setDescription(
              "Browse older stable versions"
            )
            .setEmoji("📦")
            .setValue("releases"),

          new StringSelectMenuOptionBuilder()
            .setLabel("Experimental Builds")
            .setDescription(
              "Try upcoming experimental versions"
            )
            .setEmoji("🧪")
            .setValue("experimental"),

          new StringSelectMenuOptionBuilder()
            .setLabel("Source Code")
            .setDescription(
              "Explore the TRON-Code repository"
            )
            .setEmoji("💻")
            .setValue("source")
        );

      const menuRow = new ActionRowBuilder()
        .addComponents(menu);

      // ─────────────────────────────────────
      // Send
      // ─────────────────────────────────────

      await interaction.reply({
        embeds: [embed],
        components: [
          buttons,
          menuRow
        ]
      });

      break;
    }

    default: {

      await interaction.reply({
        content: "❓ Unknown command.",
        ephemeral: true
      });

    }
  }
}

// ─────────────────────────────────────────────
// SELECT MENU
// ─────────────────────────────────────────────

async function handleSelectMenu(interaction) {

  if (interaction.customId !== "tron_downloads") {
    return;
  }

  const selected =
    downloads[interaction.values[0]];

  if (!selected) {

    await interaction.reply({
      content:
        "❌ Invalid TRON-Code selection.",
      ephemeral: true
    });

    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(`📦 ${selected.name}`)
    .setDescription(selected.description)
    .setColor(TRON_COLOR);

  if (selected.version) {

    embed.addFields({
      name: "Version",
      value:
        `\`${selected.version}\``,
      inline: true
    });
  }

  if (selected.status) {

    embed.addFields({
      name: "Status",
      value:
        `\`${selected.status}\``,
      inline: true
    });
  }

  // ─────────────────────────────────────────
  // Buttons
  // ─────────────────────────────────────────

  const buttons = [];

  if (selected.download) {

    buttons.push(
      new ButtonBuilder()
        .setLabel("Download")
        .setEmoji("⬇️")
        .setStyle(ButtonStyle.Link)
        .setURL(selected.download)
    );

  }

  if (selected.github) {

    buttons.push(
      new ButtonBuilder()
        .setLabel("GitHub")
        .setEmoji("💻")
        .setStyle(ButtonStyle.Link)
        .setURL(selected.github)
    );

  }

  const row =
    new ActionRowBuilder()
      .addComponents(buttons);

  await interaction.reply({
    embeds: [embed],
    components:
      buttons.length > 0
        ? [row]
        : [],
    ephemeral: true
  });
}

// ─────────────────────────────────────────────
// BUTTON HANDLER
// ─────────────────────────────────────────────

async function handleButton(interaction) {

  await interaction.reply({
    content:
      "⚡ This TRON action is coming soon.",
    ephemeral: true
  });
}

// ─────────────────────────────────────────────
// ERROR HANDLING
// ─────────────────────────────────────────────

process.on(
  "unhandledRejection",
  (error) => {
    console.error(
      "❌ Unhandled Promise Rejection:",
      error
    );
  }
);

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "❌ Uncaught Exception:",
      error
    );
  }
);

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────

client.login(TOKEN);