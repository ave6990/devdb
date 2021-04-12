const chai = require('chai')
const assert = chai.assert
const dateLib = require('../lib/date.js')

describe('Testing lib/date.js', () => {
	const testToDate = (string, expected) => {
		const res = dateLib.toDate(string)
		console.log(res)
		assert.equal(res, expected)
	}

	it('toDate("15.07.1990")', () => {
		testToDate('15.07.1990', new Date(1990, 6, 15))
	} )

	it('toDate("15/07/2021")', () => {
		testToDate('15/07/1990', new Date(1990, 6, 15))
	} )

	it('toString()', () => {
		const res = dateLib.toString(new Date(2021, 3, 5))
		assert.equal(res, '05.04.2021')
	} )
})
