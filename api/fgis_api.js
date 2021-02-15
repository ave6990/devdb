//const urlencode = require('urlencode')
const axios = require('axios')

const results = async (filter_obj) => {
	try {
//		const url = 'https://fgis.gost.ru/fundmetrology/cm/icdb/vri/select?fq=verification_year:2021&fq=org_title:*%D0%BE%D1%80%D0%B5%D0%BD%D0%B1%D1%83%D1%80%D0%B3%D1%81%D0%BA%D0%B8%D0%B9*&fq=org_title:*%D1%86%D1%81%D0%BC*&fq=mi.mitnumber:*10719*&fq=verification_date:[2021-01-08T00:00:00Z%20TO%202021-02-05T23:59:59Z]&q=*&fl=vri_id,org_title,mi.mitnumber,mi.mititle,mi.mitype,mi.modification,mi.number,verification_date,valid_date,applicability,result_docnum&sort=verification_date+desc,org_title+asc&rows=20&start=0'
		const url = get_url('https://fgis.gost.ru/fundmetrology/cm/icdb/vri/select', filter_obj)
		const res = await axios.get(url)
//		console.log(res.data.response.docs)
		return res.data.response.docs
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
//	sort: 'verification_date+desc,org_title+asc',
//	rows: 20,
//	start: 0,
//}
//
//console.log(get_url(res_url, res_filter))
//results(res_filter)

module.exports.results = results
