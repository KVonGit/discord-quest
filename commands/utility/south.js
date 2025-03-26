const { SlashCommandBuilder } = require('discord.js');
const q = require('../../engine/q');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('south')
		.setDescription('Go south'),
	async execute(interaction) {
		const exitName = 'south';
		// console.log('exitName:', exitName);
		const { qgame, pov } = await q.getGamePov();
		if (!pov) return;
		const loc = qgame.locations[pov.loc];
		await q.doGo(qgame, pov, loc, exitName, interaction);
	},
};