const pug = require('pug')
const fgis_api = require('../api/fgis_api')

const updateDB = (req, res) => {

}

const readRecords = (req, res) => {
	// get /mi_registry
	let content = pug.renderFile('./views/fgis_mi_registry.pug')
	res.render('index', {title: 'Реестр СИ',
		header: 'Реестр СИ',
		content: content})
}

const searchRecords = async (req, res) => {
	// post /mi_registry
	const url_filter = req.body.filter
	const data = {}
	data = await fgis_api.RegistryRecords(url_filter)
	data.numFound = data.docs.length
	res.send(data)
}

module.exports = {updateDB, readRecords, searchRecords}

