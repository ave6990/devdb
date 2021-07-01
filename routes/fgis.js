import pug from 'pug'
import csv from 'csv'
import * as fgis_api from '../api/fgis_api.js'

const getMain = (req, res) => {
	res.render('index', {title: 'Metrolog',
		header: 'My test app!!!',
		content: 'Here must be content...'})
}

const updateDB = (req, res) => {
//	db.collection('fgis')
//	.insertMany(data, (err, response) => {
//		if (err) {
//			console.log('error!!!!!!!!!')
//		console.log(err)
//			res.send({'error': 'An error has occured'})
//		} else {
//			console.log(response.ops[0])
//		}
//	})
}

const readResults = (req, res) => {
	// get /from_fgis. Unfiltered data from FGIS.
	let content = pug.renderFile('./views/from_fgis.pug')
	res.render('index', {title: 'Чтение данных из ФГИС',
		header: 'Чтение данных из ФГИС',
		content: content})
}

const readFilteredResults = async (req, res) => {
	// post /from_fgis
	const url_filter = req.body.filter
	const data = {}
	data.fgis = await fgis_api.verificationResults(url_filter)

	if (req.body.journal != '') {
		try {
			data.journal = await csvParse(req.body.journal)
			data.fgis.docs = filterRecords(data)
		} catch (err) {
			console.log(err)
		}
	} else {
		data.journal = []
	}
	data.fgis.numFound = data.fgis.docs.length
	res.send(data)
}

const filterRecords = (data) => {
	let temp_data = []
	data.journal.forEach((rec) => {
		rec['fgis_result_docnum'] = ''
		rec['fgis_vri_id'] = ''
		temp = data.fgis.docs.filter((item) => {
			if (item['mi.mitnumber'] == rec['registry_number'] &&
				item['mi.number'] == rec['serial_number']) {
				return true
			} else {
				return false
			}
		})
		temp.forEach((item) => {
			if (rec['fgis_result_docnum'] != '') {
				rec['fgis_result_docnum'] = `${rec['fgis_result_docnum']}; ${item.result_docnum}`
				rec['fgis_vri_id'] = `${rec['fgis_vri_id']}; ${item.vri_id}`
			} else {
				rec['fgis_result_docnum'] = item.result_docnum
				rec['fgis_vri_id'] = item.vri_id
			}
		})
	})
	return data.journal
}

const arrayToJson = (csv) => {
	let [header, ...records] = csv
	let data = []

	records.forEach((record, j) => {
		data[j] = new Object()
		record.forEach((value, i) => {
			data[j][header[i]] = value
		})
	})
	return data
}

const csvParse = (data, delimiter=';') => {
	return new Promise((resolve, reject) => {
		csv.parse(data, {
			comment: '#',
			delimiter: delimiter,
		}, (err, arr) => {
			if (err) {
				reject(err)
			} else {
				resolve(arrayToJson(arr))
			}
		})

	})
}

export { getMain, updateDB, readResults, readFilteredResults }

