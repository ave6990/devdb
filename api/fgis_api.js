import axios from 'axios'
import * as urlLib from '../lib/url.js'

const verificationResults = async (filter_obj) => {
	try {
		const url = urlLib.getUrl('https://fgis.gost.ru/fundmetrology/cm/icdb/vri/select', filter_obj)
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

export { verificationResults }
//module.exports.test = { verificationResults, allRecords }
