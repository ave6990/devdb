const pug = require('pug')
const csv = require('csv')
const fgis_api = require('../api/fgis_api')

module.exports = (app, db) => {
	app.get('/', (req, res) => {
		res.render('index', {title: 'Metrolog',
			header: 'My test app!!!',
			content: 'Here must be content...'})
	})
	app.get('/from_fgis', (req, res) => {
		let content = pug.renderFile('./views/from_fgis.pug')
		res.render('index', {title: 'Чтение данных из ФГИС',
			header: 'Чтение данных из ФГИС',
			content: content})
	})
	app.post('/from_fgis', async (req, res) => {
		const url_filter = req.body.filter
		const data = await fgis_api.results(url_filter)
		res.send(data)
	})
	app.get('/upload', (req, res) => {
		let content = pug.renderFile('./views/upload.pug')
		res.render('index', {title: 'Выгрузка данных в БД',
			header: 'Выгрузка данных в БД',
			content: content})
	})
	app.post('/upload', (req, res) => {
		csv.parse(req.body.csv, {
			comment: '#',
			delimiter: ';',
		}, async (err, out) => {
			if (err) {
				res.send({'error': 'An error has occured.'})
			} else {
				const data = await csvToJSON(out)
				console.log(data)
				res.send(data)
//				db.collection(req.body.name)
//				.insertMany(data, (err, response) => {
//					if (err) {
//						console.log('error!!!!!!!!!')
// 					console.log(err)
//						res.send({'error': 'An error has occured'})
//					} else {
//						console.log(response.ops[0])
//					}
//				})
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

