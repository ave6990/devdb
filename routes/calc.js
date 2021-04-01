const pug = require('pug')

const getCalc = (req, res) => {
	let content = pug.renderFile('./views/calc.pug')
	res.render('index', {title: 'Расчет СКО',
		header: 'Расчет СКО',
		content: content})
}

const calculate = async (req, res) => {
	let data = {}
	data.sko = sko(req.body.values)
	res.send(data)
}

const sko = (values) => {
	let n = values.length
	let nc = 0
	nc = values.reduce((res, val) => {
		return Number(res) + Number(val)
	}) / n
	let vals = values.map((val) => {
		return (val - nc) ** 2
	})
	return (vals.reduce((res, val) => {
		return res + val
	}) / (n - 1)) ** 0.5
}

module.exports = { getCalc, calculate }
