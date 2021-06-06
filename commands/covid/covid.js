const axios = require('axios')
const {allowed_countries} = require('../../common/api')
const {prefix} = require('../../config.json')
const {MessageEmbed} = require('discord.js')
const api = require('../../common/api')

// Utility to capitalize string
const capitalize = s => {
	if(typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
}

// Simple message embed
const simpleEmbed = msg => {
	const embed = new MessageEmbed()
	embed.description = msg
	return embed
}

// Embed takes maximum 1024 chars. let's define a func to limit
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max-3)}...` : str)

// Some fields will contain null or NA, if that's the case, replace with hypen
const nullToHypen = str => {
	if(typeof str === 'number') return str
	if(str === null) return '-'
	if(typeof str !== 'string') return '-'
	if(str.toLowerCase() == 'na' || str.toLowerCase() == 'n/a') return '-'
	return str
}

module.exports = {
	name: 'covid',
	description: 'Gets COVID stats worldwide, or from a single country',
	async execute(message, args) {
		// Check if we have arguments
		if(!args.length) {
			let reply = `You didn't provide any arguments, ${message.author}`
				+ '\n'
				+ `You can send \`${prefix}${this.name} all\` to get worldwide stats, or \`${prefix}${this.name} countries\` to get a list of allowed countries.`

			return message.channel.send(reply)
		}

		// Join args
		const fullArgs = args.join(' ').toLowerCase()

		// Is the user asking for allowed countries?
		if(fullArgs == 'countries') {
			let reply = `To use this command, send \`${prefix}${this.name} [COUNTRY]\`, where \`[COUNTRY]\` can be one of:`
				+ '`'
				+ '\n\n'
				+ allowed_countries.join('`, `')
				+ '`'

			return message.channel.send(reply)
		}

		// Is the user asking for all stats?
		if(fullArgs == 'all') {
			return message.channel.send('Sorry! At this moment I can\'t process this query')
		}

		// At this point, all we can have in fullArgs is a country.. Let's make sure it exists
		// But first, we'll convert allowed_countries to lowercase
		const allowed_countries_lc = allowed_countries.map(str => str.toLowerCase())
		if(!allowed_countries_lc.includes(fullArgs)) {
			let reply = `**${fullArgs}** is not a valid country, ${message.author}`
				+ '\n\n'
				+ `If you'd like to get a list of allowed countries, type \`${prefix}${this.name} countries\``

				return message.channel.send(reply)
		}

		// At this point we have a country and it exists.. Query time!
		const reply = await message.channel.send(simpleEmbed("Please wait! I'm getting the info for you 🙂"))

		try {
			const response = await axios.get(api.url)
			
			// If we didn't get any info
			if(!response.data.length)
				return await reply.edit(simpleEmbed("Sorry! I couldn't get the information right now 🙁"))

			// Search for the country we're looking for
			var countryData
			response.data.forEach(item => {
				if(item.country.toLowerCase() == fullArgs) {
					// Found it!
					countryData = item
				}
			})

			// Country not found?
			if(!countryData)
				return await reply.edit(simpleEmbed("Sorry! I couldn't find this country 🙁"))
			
			// Country found, let's build the embed!
			const embed = new MessageEmbed()
				.setColor('#FF0000')
				.setTitle(capitalize(fullArgs))
				.addFields(
					{ name: 'Infected', value: nullToHypen(countryData.infected), inline: true },
					{ name: '\u200b', value: '\u200b', inline: true},
					{ name: 'Tested', value: nullToHypen(countryData.tested), inline: true }
				)
				.addFields(
					{ name: 'Recovered', value: nullToHypen(countryData.recovered), inline: true },
					{ name: '\u200b', value: '\u200b', inline: true},
					{ name: 'Deceased', value: nullToHypen(countryData.deceased), inline: true }
				)
				.addField('Last update', new Date(countryData.lastUpdatedApify).toLocaleString())
				.addField('\u200b', 'Information obtained from [Apify](https://apify.com/covid19)')

			return await reply.edit(embed)
			
		}catch(error) {
			console.log(error)
			return await reply.edit(simpleEmbed("Sorry! I couldn't get the information right now 🙁"))
		}

	}
}