const urlencode = require('urlencode')
const chai = require('chai')
const assert = chai.assert
const fgis_api = require('../api/fgis_api.js')

describe('Testing fgis_api.js', () => {
	describe('verificationResults()', () => {
		it('Результат выполнения функции - объект', async () => {
			const res = await fgis_api.test.verificationResults({
				fq: {
					verification_year: 2021,
					org_title: urlencode('*оренбургский*')
				},
				q: '*',
				sort: 'verification_date+desc,org_title+asc',
				rows: 10,
				start: 0,
			})
			assert.isObject(res, 'Результат выполнения функции объект')
		})

		it('Количество полученных документов 10', async () => {
			const res = await fgis_api.test.verificationResults({
				fq: {
					verification_year: 2021,
					org_title: urlencode('*оренбургский*')
				},
				q: '*',
				sort: 'verification_date+desc,org_title+asc',
				rows: 10,
				start: 0,
			})
			assert.equal(res.docs.length, 10)
		})
	})
})
