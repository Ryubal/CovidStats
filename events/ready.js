const i18n = require('i18n')

module.exports = {
	name: 'ready',
	once: true,
	execute() {
		console.log(i18n.__('e.ready'))
	}
}