const { SlashCommandBuilder } = require('discord.js');
const core = require('../../engine/core');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('east')
		.setDescription('Go east'),
	async execute(interaction) {
		const exitName = 'east';
		// console.log('exitName:', exitName);
		const qgame = await core.loadGame('./game.json', interaction);
		const povName = interaction.user.username;
		if (qgame.players.indexOf(povName) < 0) {
			await interaction.reply({ content: core.template.mustStartGame, flags: 64 });
			return 3;
		}
		const pov = qgame[povName];
		const loc = qgame[pov.parent];
		if (typeof loc.exits == 'undefined') {
			await interaction.reply({ content: 'There are no exits!', flags: 64 });
			return;
		}
		if (typeof loc.exits[exitName] == 'undefined') {
			await interaction.reply({ content: core.template.cantGo(exitName), flags: 64 });
			return;
		}
		const exitTo = loc.exits[exitName];
		console.log('exitTo', exitTo);
		pov.parent = exitTo;
		const s = core.getLocationDescription(qgame, pov);
		await interaction.reply(`${povName} goes ${exitName}.`);
		await interaction.followUp({ content: s, flags: 64 });
		try {
			await core.saveGame('./game.json', qgame);
		}
		catch (err) {
			console.error('Error saving game data:', err);
			await interaction.followUp({ content: 'Failed to save game data.', flags: 64 });
		}
	},
};