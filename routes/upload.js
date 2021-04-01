const pug = require('pug')

const uploadFilePage = (req, res) => {
	// get /upload
	let content = pug.renderFile('./views/upload.pug')
	res.render('index', {title: 'Выгрузка данных в БД',
		header: 'Выгрузка данных в БД',
		content: content})
}

const uploadFile = async (req, res) => {
	// post /upload
	console.log('Uploading...')
	try {
		const data = await req.file
		console.log(data)
		console.log('File is uploaded')
		res.send({status: 200})
	} catch (err) {
		console.log('An error has occured')
		console.log(err)
	}
	res.redirect('/upload')
}

module.exports = {uploadFilePage, uploadFile}
