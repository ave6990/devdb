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

module.exports = {verificationResults}
module.exports.test = { verificationResults, getUrl, allRecords }
