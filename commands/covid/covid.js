const axios = require('axios')
const {allowed_countries} = require('../../common/api')
const {prefix} = require('../../config.json')
const {MessageEmbed} = require('discord.js')
const api = require('../../common/api')
const i18n = require('i18n')

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
	name: i18n.__('c.covid.name'),
	description: i18n.__('c.covid.description'),
	usage: i18n.__('c.covid.usage'),
	showInHelp: true,
	async execute(message, args) {
		// Check if we have arguments
		if(!args.length) {
			let reply = i18n.__mf('c.covid.error_no_args', {
				author: message.author,
				command_all: `${prefix}${this.name} ${i18n.__('c.covid.args.all')}`,
				command_countries: `${prefix}${this.name} ${i18n.__('c.covid.args.countries')}`
			})

			return message.channel.send(reply)
		}

		// Join args
		const fullArgs = args.join(' ').toLowerCase()

		// Is the user asking for allowed countries?
		if(fullArgs == i18n.__('c.covid.args.countries')) {
			let reply = i18n.__mf('c.covid.all_countries', {
				command: `${prefix}${this.name}`,
				allowed_countries: allowed_countries.join('`, `')
			})

			return message.channel.send(reply)
		}

		// Is the user asking for all stats? (Disabled for now)
		if(fullArgs == i18n.__('c.covid.args.all')) {
			return message.channel.send(i18n.__('c.covid.error_all_stats'))
		}

		// At this point, all we can have in fullArgs is a country.. Let's make sure it exists
		// But first, we'll convert allowed_countries to lowercase
		const allowed_countries_lc = allowed_countries.map(str => str.toLowerCase())
		if(!allowed_countries_lc.includes(fullArgs)) {
			let reply = i18n.__mf('c.covid.error_invalid_country', {
				country: fullArgs,
				author: message.author,
				command_countries: `${prefix}${this.name} ${i18n.__('c.covid.args.countries')}`
			})

			return message.channel.send(reply)
		}

		// At this point we have a country and it exists.. Query time!
		const reply = await message.channel.send(simpleEmbed(i18n.__('c.covid.loading')))

		try {
			const response = await axios.get(api.url)
			
			// If we didn't get any info
			if(!response.data.length)
				return await reply.edit(simpleEmbed(i18n.__('c.covid.error_no_info')))

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
				return await reply.edit(simpleEmbed(i18n.__('c.covid.error_no_country')))
			
			// Country found, let's build the embed!
			const embed = new MessageEmbed()
				.setColor('#FF0000')
				.setTitle(capitalize(fullArgs))
				.addFields(
					{ name: i18n.__('c.covid.infected'), value: nullToHypen(countryData.infected), inline: true },
					{ name: '\u200b', value: '\u200b', inline: true},
					{ name: i18n.__('c.covid.tested'), value: nullToHypen(countryData.tested), inline: true }
				)
				.addFields(
					{ name: i18n.__('c.covid.recovered'), value: nullToHypen(countryData.recovered), inline: true },
					{ name: '\u200b', value: '\u200b', inline: true},
					{ name: i18n.__('c.covid.deceased'), value: nullToHypen(countryData.deceased), inline: true }
				)
				.addField(i18n.__('c.covid.last_update'), new Date(countryData.lastUpdatedApify).toLocaleString())
				.addField('\u200b', i18n.__mf('c.covid.information_obtained', {url: 'https://apify.com/covid19'}))

			return await reply.edit(embed)
			
		}catch(error) {
			console.log(error)
			return await reply.edit(simpleEmbed(i18n.__('c.covid.error_no_info')))
		}

	}
}