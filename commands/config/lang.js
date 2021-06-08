const {prefix} = require('../../config.json')
const i18n = require('i18n')

const fs = require('fs')
const path = require('path')

module.exports = {
	name: i18n.__('c.lang.name'),
	description: i18n.__('c.lang.description'),
	execute(message, args) {
		// If no arguments, we'll return a list of installed languages
		// If arguments, we expect it to be a language to switch to

		if(args.length == 0) {
			const installedLangs = i18n.getLocales().join('`, `')

			const reply = i18n.__mf('c.lang.available_langs', {
				installed_langs: installedLangs,
				prefix: prefix
			})

			return message.channel.send(reply)
		}

		// At this point we have an argument
		// Make sure it is a valid lang
		if(!i18n.getLocales().includes(args[0])) {
			const reply = i18n.__mf('c.lang.error_invalid_lang', {
				lang: args[0],
				prefix: prefix
			})

			return message.channel.send(reply)
		}

		// Set language
		i18n.setLocale(args[0])

		// Since commands will vary depending on the language, we need to reload all
		// of them whenever the lang changes.. Let's do that
		// First.. Remove all commands
		message.client.commands.clear()

		// Now add them back
		const commandFolders = fs.readdirSync('./commands')
		for(const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('js'))
			for(const file of commandFiles) {
				delete require.cache[require.resolve(`../${folder}/${file}`)]

				const newCommand = require(`../${folder}/${file}`)
				message.client.commands.set(newCommand.name, newCommand)
			}
		}

		// And reply
		return message.channel.send(i18n.__('c.lang.language_switched'))
	}
}