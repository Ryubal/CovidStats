const {version} = require('../../config.json')
const i18n = require('i18n')

module.exports = {
	name: i18n.__('c.version.name'),
	description: i18n.__('c.version.description'),
	usage: i18n.__('c.version.usage'),
	showInHelp: true,
	execute(message, args) {
		message.channel.send(i18n.__mf('c.version.version_msg', {version: version}))
	}
}