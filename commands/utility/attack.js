const { SlashCommandBuilder } = require('discord.js');
// const fs = require('fs');
const q = require('../../engine/q');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('attack')
		.setDescription('Attack something (or someone)!')
		.addStringOption(option =>
			option.setName('target')
				.setDescription('The target you wish to attack')
				.setRequired(true)),
	async execute(interaction) {
		const object = interaction.options.getString('target');
		if (typeof object == 'undefined') {
			await q.msg('\'' + object + '\' not defined.');
			return;
		}
		if (typeof q.getObject(qgame, object) == 'undefined') {
			await q.msg('No such object ("' + object + '")!');
			return;
		}
		const obj = q.getObject(qgame, object);
		if (!q.inScope(obj)) {
			await q.msg(q.template.cantSee(obj.name));
			return;
		}
		if (typeof obj.attack == 'undefined') {
			await q.msg(q.template.defaultAttack(q.GetDisplayName(obj)));
		}
		else if (typeof obj.attack.type == 'undefined') {
			await q.msg(q.template.defaultAttack(q.GetDisplayName(obj)));
		}
		else if (obj.attack.type == 'string') {
			await q.msg(`${pov.alias} has attacked ${q.GetDisplayName(obj)}!`, false, false);
			await q.msg(obj.attack.attr, true, true);
		}
		else if (obj.attack.type == 'script') {
			// eslint-disable-next-line prefer-const
			let responded = false;
			await eval (obj.attack.attr);
			if (!responded) {
				await q.msg(q.template.defaultAttack(q.GetDisplayName(obj)));
			}
		}
		else {
			const s = q.template.defaultAttack(q.GetDisplayName(obj));
			await q.msg(s);
		}
	},
};
