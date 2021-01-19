const pug = require('pug')
let copyright = 'ave6990@ya.ru 2021'

module.exports = (app, db) => {
	app.get('/', (req, res) => {
		res.render('index', {title: 'Metrolog', 
			header: 'My test app!!!',
			content: 'Here must be content...',
			copyright: copyright})
	})
	app.get('/ggs', (req, res) => {
		let content = pug.renderFile('./views/ggs.pug')
		res.render('index', {title: 'ГГС-03-03',
			header: 'Расчет режимов работы генератора ГГС-03-03',
			content: content,
			copyright: copyright})
	})
}

