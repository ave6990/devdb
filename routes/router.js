const pug = require('pug')
let copyright = 'ave6990@ya.ru 2021'

module.exports = (app, db) => {
	app.get('/', (req, res) => {
		res.render('index', {title: 'Metrolog',
			header: 'My test app!!!',
			content: 'Here must be content...',
			copyright: copyright})
	})
	app.get('/upload', (req, res) => {
		let content = pug.renderFile('./views/upload.pug')
		res.render('index', {title: 'Выгрузка данных в БД',
			header: 'Выгрузка данных в БД',
			content: content,
			copyright: copyright})
	})
	app.post('/upload', (req, res) => {
		console.log(req.body.text)
//		res.redirect('/upload')
	})
	app.get('/ggs', (req, res) => {
		let content = pug.renderFile('./views/ggs.pug')
		res.render('index', {title: 'ГГС-03-03',
			header: 'Расчет режимов работы генератора ГГС-03-03',
			content: content,
			copyright: copyright})
	})
}

