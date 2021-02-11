const pug = require('pug')
const csv = require('csv')

module.exports = (app, db) => {
	app.get('/', (req, res) => {
		res.render('index', {title: 'Metrolog',
			header: 'My test app!!!',
			content: 'Here must be content...'})
	})
	app.get('/upload', (req, res) => {
		let content = pug.renderFile('./views/upload.pug')
		res.render('index', {title: 'Выгрузка данных в БД',
			header: 'Выгрузка данных в БД',
			content: content})
	})
	app.post('/upload', async (req, res) => {
		await csv.parse(req.body.csv, {
			comment: '#',
			delimiter: ';',
		}, (err, out) => {
			if (err) {
				res.send({'error': 'An error has occured.'})
			} else {
				const data = csvToJSON(out)
				db.collection('journal')
				.insertMany(data, (err, response) => {
					if (err) {
						console.log('error!!!!!!!!!')
						console.log(err)
						res.send({'error': 'An error has occured'})
					} else {
						console.log(response.ops[0])
					}
				})
			}
		})
//		res.redirect('/upload')
	})
	app.get('/ggs', (req, res) => {
		let content = pug.renderFile('./views/ggs.pug')
		res.render('index', {title: 'ГГС-03-03',
			header: 'Расчет режимов работы генератора ГГС-03-03',
			content: content})
	})
}

const csvToJSON = (csv) => {
	let [header, ...records] = csv
	let data = []

	records.forEach((record, j) => {
		data[j] = new Object()
		record.forEach((value, i) => {
			data[j][header[i]] = value
		})
	})
	return data
}
