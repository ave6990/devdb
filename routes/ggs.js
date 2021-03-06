const pug = require('pug')

const GGSCalc = (req, res) => {
	let content = pug.renderFile('./views/ggs.pug')
	res.render('index', {title: 'ГГС-03-03',
		header: 'Расчет режимов работы генератора ГГС-03-03',
		content: content})
}

module.exports = GGSCalc
