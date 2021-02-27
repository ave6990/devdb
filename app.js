const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes/router.js')
const config = require('./config.js')
const app = express()
const port = 3300

app.set('view engine', 'pug')
app.use(bodyParser.json({limit: '50mb', extended: true, parameterLimit: 50000}))

const MongoClient = require('mongodb').MongoClient
const url = `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.db}`
const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}

MongoClient.connect(url, options, (err, client) => {
	if (err) {
		console.log(err)
	}
	const db = client.db('devices')
	router(app, db)
	app.listen(port, () => {
		console.log('Devices data base run.')
	})
//	client.close()
})

