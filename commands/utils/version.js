const {version} = require('../../config.json')

module.exports = {
	name: 'version',
	description: 'Gets current version',
	execute(message, args) {
		message.channel.send(`🤖 My current version is ${version}`)
	}
}