const i18n = require('i18n')

module.exports = {
	name: i18n.__('c.ping.name'),
	description: i18n.__('c.ping.description'),
	execute(message, args) {
		message.channel.send(i18n.__('c.ping.ping_msg'))
	}
}