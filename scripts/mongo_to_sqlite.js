const sqlite = require('sqlite3').verbose()
const mongoose = require('mongoose')
const reg = require('../models/mi_registry')
const config = require('../config')
const date = require('../lib/date')

let mongo_db = mongoose.connect(config.db.uri, config.db.options)

let sql_db = new sqlite.Database('./metrolog.db')

const readData = async (model, selected_fields, page, limit) => {
	let result = {}

	result.total_count = await model.find({}).countDocuments()

	result.records = await new Promise( (resolve, reject) => {
		model.find({})
		.skip(page * limit)
		.limit(limit)
		.select(selected_fields)
		.exec( (err, data) => {
			if (err) {
				reject(err)
			} else {
				resolve(data)
			}
		} )
	} )

	return result
}

const createQuery = (table_name, fields_obj) => {
	let query = Object.keys(fields_obj).map( (field) => {
		return `${field} ${fields_obj[field]}`
	} ).join(', ')

	query = `CREATE TABLE ${table_name}(id integer primary key autoincrement, ${query})`

	return query
}

const insertQuery = (table_name, fields) => {
	// @@debug: where is obj._doc from? What is it obj???
	const columns = Object.keys(fields).join(', ')
	const values = Object.keys(fields).map((item) => `?`).join(', ')

	return `INSERT INTO ${table_name} (${columns}) VALUES (${values})`
}

const selectQuery = async () => {
	let query = ''
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

const createTable = (sqlite_db, table_name, fields) => {
	let sql = createQuery(table_name, fields)
	console.log(sql, '\n')
	sqlite_db.run(sql)
	console.info(`Table ${table_name} is created.`)
}

const addOptFields = (obj, fields) => {
	let res = {}
	for (const item of fields) {
		if (Object.keys(obj).indexOf(item) >= 0) {
			if (['certificate_life', 'publication_date'].indexOf(item) >= 0) {
				res[item] = date.toString(obj[item])
			} else {
				res[item] = obj[item]
			}
		} else {
			res[item] = 'undefined'
		}
	}

	return res
}

const copyData = async (model, selected_fields, sql_db, fields) => {
	const page_size = 1000

	console.info('Copy the data from mongodb to sqlite3.\n')
	let data = await readData(model, selected_fields, 1, 1)
	const sql = insertQuery('mi_registry', fields)
	console.info(sql, '\n')
	const total_count = parseInt(data.total_count / page_size) + 1

	for (let i = 0; i < total_count; i++) {
		data = await readData(model, selected_fields, i, page_size)
		for (const [j, record] of data.records.entries()) {
			const full_record = addOptFields(record._doc, Object.keys(fields))
			sql_db.run(sql, Object.values(full_record), (err) => {
				if (err) {
					console.error('Error occured: script/mongo_to_sqlite.js')
					console.error(err, '\n')
				}
			} )
		}
		let percent = Math.round(parseFloat((i + 1) / total_count) * 10000) / 100
		console.info(`\tCopy the ${i} page of ${total_count} pages [ ${percent} % ].`)
	}

}

const selected_fields = {
	_id: 0,
	manufacturer: 0,
}

const main = async () => {
	createTable(sql_db, 'mi_registry', fields)
	copyData(reg, selected_fields, sql_db, fields)
}

main()

//mongoose.connection.close()
//sql_db.close()
