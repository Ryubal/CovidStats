const {version} = require('../../config.json')

module.exports = {
	name: 'author',
	description: 'Gets bot creator',
	execute(message, args) {
		message.channel.send(`Ricardo Yubal is my creator!`)
		message.channel.send('http://github.com/ryubal')
	}
}