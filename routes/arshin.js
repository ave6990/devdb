import pug from 'pug'

const getMain = (req, res) => {
	// get /arshin. Data from FGIS.
	let content = pug.renderFile('./views/arshin.pug')
	res.render('index', {title: 'Результаты поверки',
		header: 'Результаты поверки',
		content: content})
}

export { getMain }

