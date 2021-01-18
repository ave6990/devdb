module.exports = (app, db) => {
	app.get('/', (req, res) => {
		res.render('index', {title: 'Metrolog', 
			header: 'My test app!!!',
			content: 'Here must be content...',
			copyright: 'ave6990@ya.ru 2021'})
	})
	app.get('/ggs', (req, res) => {
		res.render('ggs')
	})
}
