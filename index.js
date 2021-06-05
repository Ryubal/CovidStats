const Discord = require('discord.js')
const {prefix, token} = require('./config.json')

// Start Discord client
const client = new Discord.Client()

// Attach events
client.once('ready', () => {
	console.log('Ready!')
})

client.on('message', message => {
	// Avoid replying to non-command or bot messages
	if(!message.content.startsWith(prefix) || message.author.bot) return

	// Get command and arguments
	const args = message.content.slice(prefix.length).trim().split(' ')
	const command = args.shift().toLowerCase()

	if(command == 'ping')
		message.channel.send('Pong!')
})

client.login(token)