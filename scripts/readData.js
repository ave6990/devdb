const MongoClient = require('mongodb').MongoClient
const fs = require('fs')
const parse = reuire('csv-parse')

const url = 'mongodb://admin:pass@localhost:27017/devices'

MongoClient(url,
	{useNewUrlParser: true, useUnifiedTopology:true,},
	(err, client) => {
		if (err) {
			console.log(err)
		}

		const db = client.db('devices')

		fs.readFile()

		client.close()
	}
)
