const { SlashCommandBuilder } = require('discord.js');
const q = require('../../engine/q');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('players')
		.setDescription('See the current active players in the game.'),
	async execute(interaction) {
		global.interaction = interaction;
		const { qgame, pov } = await q.getGamePov();
		if (!pov) return;
		const s = '### Now Playing:\n' + q.GetObjectListAsString(q.AllPlayers(qgame));
		await q.msg(s);
	},
};
