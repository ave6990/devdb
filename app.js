const express = require('express')
const router = require('./routes/router.js')
const app = express()
const port = 3000

app.set('view engine', 'pug')

//const util = require('util')
//const MongoClient = require('mongodb').MongoClient
//const url = util.format(
//	'mongodb://%s:%s@%s/?replicaSet=%s&authSource=%s&ssl=true',
//	'ave6990',
//	'enter69free',
//	[
//		'rc1a-m3rxy7w8xliezifo.mdb.yandexcloud.net:27018',
//		'rc1b-vkap0d2xwfgl5ivu.mdb.yandexcloud.net:27018',
//		'rc1c-o3h3ugow9n9km771.mdb.yandexcloud.net:27018'
//	].join(','),
//	'rs01',
//	'devdb'
//)
//
//const options = {
//	useNewUrlParser: true,
//	useUnifiedTopology: true,
//}
//
//MongoClient.connect(url, options, (err, db) => {
//	const dbo = db.db('devdb')
//})

router(app, {})
app.listen(port, () => {
	console.log('Devices data base run.')
})
