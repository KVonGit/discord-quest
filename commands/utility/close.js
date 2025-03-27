const { SlashCommandBuilder } = require('discord.js');
const q = require('../../engine/q');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('close')
		.setDescription('Close something')
		.addStringOption(option =>
			option.setName('object')
				.setDescription('The object you wish to close')
				.setRequired(true)),
	async execute(interaction) {
		const { qgame, pov } = await q.getGamePov();
		if (!pov) return;

		const object = interaction.options.getString('object');
		if (typeof object == 'undefined') {
			await interaction.reply('\'object\' not defined.');
			return;
		}
		const obj = q.getObject(qgame, object);
		if (typeof obj == 'undefined') {
			await q.msg('No such object ("' + object + '")!');
			return;
		}

		if (!q.inScope(obj)) {
			await q.msg(q.template.cantSee(q.GetDisplayName(obj)));
			return;
		}

		if (obj.isOpen === false) {
			await q.msg(q.template.alreadyClosed(q.GetDisplayName(obj)));
			return;
		}
		let { type, attr } = q.getAttribute(obj, 'close');
		if (typeof type == 'undefined') {
			if (obj.inherit?.indexOf('closable') > -1) {
				type = 'boolean';
				attr = true;
			}
			else {
			    await q.msg(q.template.cantOpenOrClose(q.GetDisplayName(obj)));
			    await finishUp();
			    return;
			}
		}
		else {
			if (type == 'string') {
				await q.msg(attr);
				await finishUp();
				return;
			}
			if (type == 'boolean') {
				obj.isOpen = false;
				if (typeof obj.closeMsg == 'string') {
					await q.msg(obj.closeMsg);
				}
				else {
					await q.msg(q.template.defaultClose(q.GetDisplayName(obj)));
				}
				if (typeof obj.afterClosingMsg == 'string') {
					await q.msg(obj.afterClosingMsg);
				}
				if (obj.afterClosing) {
					try {
						await eval(obj.afterClosing);
					}
					catch {
						console.error('Error in ' + obj.name + ' afterClosing script.');
						await q.msg('Error in afterClosing script.');
					}
				}
				await q.saveGame('./game.json', qgame);
				await finishUp();
				return;
			}
		}
		await q.msg(q.template.cantOpenOrClose(q.GetDisplayName(obj, true)));

		async function finishUp() {
			try {
				await q.saveGame('./game.json', qgame);
			}
			catch (err) {
				console.error('Error saving game data:', err);
				await q.msg('Failed to save game data.');
			}
		}
	},
};