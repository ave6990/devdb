const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes/router.js')
const app = express()
const port = 3000

app.set('view engine', 'pug')
app.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient
const util = require('util')
const url = util.format(
	'mongodb://%s:%s@%s:%s/%s',
	'admin',
	'pass',
	'localhost',
	'27017',
	'devices'
)

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
	client.close()
})
