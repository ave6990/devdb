import pug from 'pug'

const getCalc = (req, res) => {
	let content = pug.renderFile('./views/mcalc.pug')
	res.render('index', {title: 'Метролог',
		header: 'Метролог',
		content: content})
}

const calculate = async (req, res) => {
	let data = {}
	data.sko = sko(req.body.values)
	res.send(data)
}

const sko = (values) => {
	const n = values.length
	const nc = values.reduce((res, val) => {
		return Number(res) + Number(val)
	}) / n
	let vals = values.map((val) => {
		return (val - nc) ** 2
	})
	return (vals.reduce((res, val) => {
		return res + val
	}) / (n - 1)) ** 0.5
}

export { getCalc, calculate }
