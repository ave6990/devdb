const axios = require('axios')

const verificationResults = async (filter_obj) => {
	try {
		const url = getUrl('https://fgis.gost.ru/fundmetrology/cm/icdb/vri/select', filter_obj)
		const res = await axios.get(url)
		return res.data.response
	} catch (err) {
		console.log('fgis_api.js error!!!')
	}
}

const registryRecords = async (filter_obj) => {
	try {
		const url = getUrl('https://fgis.gost.ru/fundmetrology/api/registry/4/data', filter_obj)
		const res = await axios.get(url)
		return res.data.result
	} catch (err) {
		consol.log('fgis_api.js error!!!')
	}
}

const registryRecord = async (id) => {
	try {
		const res = await axios.get(`https://fgis.gost.ru/fundmetrology/api/registry/4/items/${id}/data`)
		return res.data.result
	} catch (err) {
		console.log('fgis_api.js error!!!')
		console.log(err)
	}
}

const allRecords = async (filter_obj) => {
	try {
		let rows = 10
		let start = 0

		const res_filter = {
			q: '*',
			sort: 'verification_date+desc,org_title+asc',
			rows: rows,
			start: start,
		}
	} catch (err) {
		console.log('fgis_api.js [allRecords()] error!')
	}
}

const getUrl = (url, filter_obj) => {
	if (filter_obj) {
		url += '?'

		for (let item in filter_obj) {
			if (typeof(filter_obj[item]) == 'object') {
				for (let opt in filter_obj[item]) {
					url += `${item}=${opt}:${filter_obj[item][opt]}&`
				}
			} else {
				url += `${item}=${filter_obj[item]}&`
			}
		}
	}
	return url
}

module.exports = {verificationResults, registryRecords, registryRecord}
module.exports.test = { verificationResults, registryRecords, getUrl, allRecords }
