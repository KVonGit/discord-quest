const { SlashCommandBuilder } = require('discord.js');
const core = require('../../engine/core');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('drop')
		.setDescription('Drop something')
		.addStringOption(option =>
			option.setName('object')
				.setDescription('The object you wish to drop')),
	async execute(interaction) {
		const object = interaction.options.getString('object');
		if (typeof object == 'undefined') {
			await interaction.reply({ content: '\'object\' not defined.', flags: 64 });
			return;
		}
		const qgame = await core.loadGame('./game.json', interaction);
		const povName = interaction.user.username;
		if (qgame.players.indexOf(povName) < 0) {
			await interaction.reply({ content: core.template.mustStartGame, flags: 64 });
			return 3;
		}
		if (typeof qgame[object] == 'undefined') {
			await interaction.reply({ content: 'No such object ("' + object + '")!', flags: 64 });
			return;
		}
		const obj = qgame[object];
		const pov = qgame[povName];
		// TODO - Check the object parent first!
		if (obj.parent != pov.name) {
			await interaction.reply({ content: core.template.dontHave(obj.name), flags: 64 });
			return 0;
		}
		let qdropped = false;
		switch (typeof obj.drop) {
		case 'undefined':
			// let it be dropped
			qdropped = true;
			obj.parent = qgame[pov.parent].name;
			break;
		case 'string':
			// nope
			await interaction.reply({ content: obj.take, flags: 64 });
			break;
		case 'boolean':
			if (obj.drop) {
				// drop it!
				qdropped = true;
				obj.parent = qgame[pov.parent].name;
			}
			else {
				// can't get it!
				await interaction.reply({ content: core.template.cantDrop(obj.name), flags: 64 });
			}
			break;
		case 'function':
			// call function
			obj.drop({ 'this':obj, 'pov':pov });
			qdropped = (obj.parent != pov.name);
			break;
		}
		if (qdropped) {
			// tell everybody!
			await interaction.reply(`${pov.name} dropped ${object}.`);
			// need to return something if take is a function, to know if it printed something!
			await interaction.followUp({ content: 'Dropped.', flags: 64 });
			try {
				await core.saveGame('./game.json', qgame);
			}
			catch (err) {
				console.error('Error saving game data:', err);
				await interaction.followUp({ content: 'Failed to save game data.', flags: 64 });
			}
		}
		else {
			return 0;
		}

	},
};