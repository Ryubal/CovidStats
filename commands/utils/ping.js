module.exports = {
	name: 'Ping',
	description: 'Pings bot',
	execute(message, args) {
		message.channel.send('Pong!')
	}
}