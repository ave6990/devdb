const pug = require('pug')
const mongoose = require('mongoose')
const xlsx = require('xlsx')
const reg = require('../models/mi_registry')

const readRecords = async (req, res) => {
	// get /mi_registry
	let content = pug.renderFile('./views/mi_registry.pug')
	res.render('index', {title: 'Реестр СИ',
		header: 'Реестр СИ',
		content: content})
}

const searchRecords = async (req, res) => {
	// post /mi_registry
	let query = {}
	let res_data = {}

	if (req.body.registry_number) {
		query['registry_number'] = new RegExp(`.*${req.body.registry_number}.*`, 'i')
	} else if (req.body.type) {
		query['types'] = new RegExp(`.*${req.body.type}.*`, 'i')
	}

	try {
		res_data.total_count = await reg.find(query).countDocuments()
		res_data.data = await new Promise( (resolve, reject) => {
			reg.find(query)
			.skip(req.body.skip)
			.limit(req.body.limit)
//			@@debug: Need much more memory.
//			.sort({ registry_number: 1 })
//			.select( {
//				_id: 0,
//				registry_number: 1,
//				name: 1,
//				types: 1,
//				manufacturer_total: 1,
//				fgis_id: 1,
//			} )
			.exec( (err, data) => {
				if (err) {
					reject(err)
				}
				resolve(data)
			} )
		} )
	} catch (err) {
		console.log('Error occured: routes/mi_registry.js')
		console.log(err)
	}

	res.send(res_data)
}

module.exports = { readRecords, searchRecords }
