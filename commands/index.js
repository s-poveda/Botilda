// const { Collection } = require('discord.js');


const 
  { Collection } = require('discord.js');
  fs = require('node:fs'),
  path = require('node:path'),
  { SlashCommandBuilder } = require('@discordjs/builders'),
  commandFiles = fs
      .readdirSync(__dirname)
      .filter((file) => file.endsWith(".c.js"));

module.exports = {
  register_slash_commands: () => {
    client.commands = new Collection();
    for( const file of commandFiles) {
      const 
        filePath = path.join(__dirname, file),
        command = require(filePath);
      client.commands.set(command.data.name, command);
    }
  },
};
