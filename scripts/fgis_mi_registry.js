const mongoose = require('mongoose')
const MIRegistry = require('../models/mi_registry')
const fgis = require('../api/fgis_mi_registry_api')
const config = require('../config')

const url = `mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.db}`
const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}

mongoose.connect(url, options)

const readData = async (page_size = 20) => {
	let last_page = 3
	let res = []
	for (let i = 1; i <= last_page; i++) {
		const data = await fgis.getPage(i, page_size)
		if (i == 1) {
			last_page = parseInt(data.total_count / page_size) + 1
		}
		let percent = Math.round(parseFloat(i / last_page) * 10000) / 100
		console.log(`Getting ${i} page of ${last_page} [${percent} %]`)
		writeData(data.data)
	}
	return true
}

const writeData = (in_data) => {
	MIRegistry.insertMany(in_data, (err, data) => {
		let message = ''

		if (err) {
			message = 'Error!!!'
			console.log(err)
		} else {
			message = 'Successfull saved to database!'
		}
		console.log(message)
	} )
}

readData(500)
//mongoose.connection.close()

module.exports = { readData, writeData }
