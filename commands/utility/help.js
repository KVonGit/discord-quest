const { SlashCommandBuilder } = require('discord.js');
const q = require('../../engine/q');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get little help with the game.'),
	aliases: ['commands', 'commandlist'],
	async execute(interaction) {
		global.interaction = interaction;
		const { qgame, pov } = await q.getGamePov();
		if (!pov) return;
		global.qgame = qgame;
		global.pov = pov;
		const s = 'Enter `/` to see a list of available commands.';
		await msg(s);
	},
};
