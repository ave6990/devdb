const urlencode = require('urlencode')
const chai = require('chai')
const assert = chai.assert
const urlLib = require('../lib/url.js')

describe('Testing lib/url.js', () => {
	describe('getUrl()', () => {
		const url = 'https://fgis.gost.ru/fundmetrology/cm/icdb/vri/select'

		const testGetUrl = ( { filter_obj, expected } ) => {
			const res = urlLib.getUrl(url, filter_obj)
			assert.equal(res, expected)
		}

		it('Url запроса результатов поверки 2021 года', () => {
			const res = urlLib.getUrl(url, {
				fq: {
					verification_year: 2021,
				},
			})
			const expected = 'https://fgis.gost.ru/fundmetrology/cm/icdb/vri/select?fq=verification_year:2021&'
			assert.equal(res, expected)
		})

		it('Url запроса результатов поверки 2021 с заданными фильтрами', () => {
			const res = urlLib.getUrl(url, {
				fq: {
					verification_year: 2021,
					org_title: urlencode('*оренбургский*')
				},
				q: '*',
				fl: 'vri_id,mi.mitnumber,mi.modification,mi.number,verification_date,result_docnum',
				sort: 'verification_date+desc,org_title+asc',
				rows: 99000,
				start: 0,
			})
			const expected = 'https://fgis.gost.ru/fundmetrology/cm/icdb/vri/select?fq=verification_year:2021&fq=org_title:*%D0%BE%D1%80%D0%B5%D0%BD%D0%B1%D1%83%D1%80%D0%B3%D1%81%D0%BA%D0%B8%D0%B9*&q=*&fl=vri_id,mi.mitnumber,mi.modification,mi.number,verification_date,result_docnum&sort=verification_date+desc,org_title+asc&rows=99000&start=0&'
			assert.equal(res, expected)
		})
	})
})
