const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const mongoose = require('mongoose')
const config = require('./config.js')
const fgis = require('./routes/fgis.js')
const upload_route = require('./routes/upload.js')
const ggs = require('./routes/ggs.js')
const conditions = require('./routes/conditions.js')
const calc = require('./routes/calc.js')

const port = 3300

const app = express()
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.text())
app.use(bodyParser.json({type: 'application/json'}))

const url = `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.db}`
const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}

mongoose.connect(url, options)

const urlencodedParser = bodyParser.urlencoded({extended: false})
const upload = multer({dest: 'uploads'})

app.get('/', fgis.getMain)
app.get('/ggs', ggs)
app.route('/from_fgis')
	.get(fgis.readResults)
	.post(fgis.readFilteredResults)
app.route('/upload')
	.get(upload_route.uploadFilePage)
	.post(upload.single('input_file'), upload_route.uploadFile)
app.route('/conditions')
	.get(conditions.getConditions)
	.post(conditions.postCondition)
	.put(conditions.updateCondition)
app.route('/calc')
	.get(calc.getCalc)
	.post(calc.calculate)

app.listen(port, () => {
	console.log(`App started at port: ${port}`)
})

// for testing app
module.exports = app
