const { SlashCommandBuilder } = require('discord.js');
const q = require('../../engine/q');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('See what you are carrying.'),
	async execute(interaction) {
		global.interaction = interaction;
		const { qgame, pov } = await q.getGamePov();
		if (!pov) return;
		const s = q.getInventoryAsString(qgame, pov);
		await q.msg(s);
	},
};
