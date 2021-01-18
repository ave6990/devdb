const express = require('express')
const router = require('./routes/router.js')
const MongoClient = require('mongodb').MongoClient
const app = express()
const port = 3000

app.set('view engine', 'pug')

router(app, {})
app.listen(port, () => {
	console.log('Devices data base run.')
})
