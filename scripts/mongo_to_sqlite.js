const sqlite = require('sqlite').verbose()
const mongoose = require('mongoose')
const reg = require('../models/mi_registry')
const config = require('../config')

mongoose.connect(config.db.uri, config.db.options)

let db = new sqlite.Database('./mi_registry.db')

const readData = async () => {
	const records = await new Promise( (resolve, reject) => {
		reg.find({})
		.select( {
			_id: 0,
			manufacturer: 0,
		})
		.exec( (err, data) => {
			if (err) {
				reject(err)
			} else {
				resolve(data)
			}
		} )
	} )

	return records
}

const createQuery = (db, table_name, fields_obj) => {
	let query = ''

	for (const field of Object.keys(fields_obj)) {
		query = `${field} ${fields_obj[field]}, `
	}

	query = `CREATE TABLE ${table_name}(${query})`

	return query
}

const insertQuery = async (data) => {
	let query = data.map((record) => '?').join(', ')
	query = `(${placeholders})`
}

const fields = {
	fgis_id: 'integer',
	registry_number: 'text',
	name: 'text',
	types: 'text',
	manufacturer_total: 'text',
	type_description: 'text',
	verification_document: 'text',
	procedure: 'text',
	mi_info: 'text',
	certificate_life: 'text',
	serial_number: 'text',
	verification_interval: 'text',
	periodic_verification: 'text',
	interval_years: 'integer',
	interval_months: 'integer',
	mi_status: 'text',
	publication_date: 'text',
	record_number: 'integer',
	party_verification: 'text',
	status: 'text',
}

createTable(db, 'mi_registry', fields)
