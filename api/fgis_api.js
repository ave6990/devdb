//const urlencode = require('urlencode')
const axios = require('axios')

const results = async (filter_obj) => {
	try {
		const url = get_url('https://fgis.gost.ru/fundmetrology/cm/icdb/vri/select', filter_obj)
		const res = await axios.get(url)
//		console.log(res.data.response)
		return res.data.response
	} catch (err) {
		console.log('fgis_api.js error!!!')
//		console.log(err)
	}
}

const get_url = (url, filter_obj) => {
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

//const res_url = 'https://fgis.gost.ru/fundmetrology/cm/icdb/vri/select'
//const res_filter = {
//	fq: {
//		verification_year: 2021,
//		org_title: urlencode('*оренбургский*')
//	},
//	q: '*',
////	fl: 'vri_id,org_title,mi.mitnumber,mi.mititle,mi.mitype,mi.modification,mi.number,verification_date,valid_date,applicability,result_docnum',
//	fl: 'vri_id,mi.mitnumber,mi.modification,mi.number,verification_date,result_docnum',
//	sort: 'verification_date+desc,org_title+asc',
//	rows: 99000,
//	start: 0,
//}
//
//const test = async () => {
//	console.log(await results(res_filter))
//}
//
//test()

module.exports.results = results
