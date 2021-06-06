const Discord = require('discord.js')
const {token} = require('./config.json')
const fs = require('fs')

// Start Discord client, and define commands collection
const client = new Discord.Client()
client.commands = new Discord.Collection()

// Load commands from ./commands
const commandFolders = fs.readdirSync('./commands')
for(const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('js'))
	for(const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`)
		client.commands.set(command.name, command)
	}
}

// Load events from ./events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('js'))
for(const file of eventFiles) {
	const event = require(`./events/${file}`)
	
	// When importing, we'll pass client
	if(event.once)
		client.once(event.name, (...args) => event.execute(...args, client))
	else
		client.on(event.name, (...args) => event.execute(...args, client))
}

// Login!
client.login(token)