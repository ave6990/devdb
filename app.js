const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const config = require('./config.js')
const fgis = require('./routes/fgis.js')
const ggs = require('./routes/ggs.js')
const conditions = require('./routes/conditions.js')

const port = 3300

const app = express()
app.set('view engine', 'pug')
//app.use(bodyParser.json({limit: '50mb', extended: true, parameterLimit: 50000}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.text())
app.use(bodyParser.json({type: 'application/json'}))

//const MongoClient = require('mongodb').MongoClient
//const url = `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.db}`
//const options = {
//	useNewUrlParser: true,
//	useUnifiedTopology: true,
//}
//
//MongoClient.connect(url, options, (err, client) => {
//	if (err) {
//		console.log(err)
//	}
//	const db = client.db('devices')
//	router(app, db)
//	app.listen(port, () => {
//		console.log('Devices data base run.')
//	})
////	client.close()
//})

const urlencodedParser = bodyParser.urlencoded({extended: false})
const upload = multer({dest: 'uploads'})
app.get('/', fgis.getMain)
app.get('/ggs', ggs)
app.route('/from_fgis')
	.get(fgis.readResults)
	.post(fgis.readFilteredResults)
app.route('/upload')
	.get(fgis.uploadFilePage)
	.post(upload.single('input_file'), fgis.uploadFile)
app.route('/conditions')
	.get(conditions.read)
	.post(urlencodedParser, conditions.write)
	.put(conditions.update)

app.listen(port, () => {
	console.log(`App started at port: ${port}`)
})

// for testing app
module.exports = app
