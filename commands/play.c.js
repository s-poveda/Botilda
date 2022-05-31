const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('play')
            .setDescription("Begin playing a song or playlist by URL"),
    async execute(interaction) {
        
    },
};