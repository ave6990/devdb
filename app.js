const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const mongoose = require('mongoose')
const config = require('./config.js')
const fgis = require('./routes/fgis.js')
const upload_route = require('./routes/upload.js')
const ggs = require('./routes/ggs.js')
const conditions = require('./routes/conditions.js')
const mcalc = require('./routes/mcalc.js')
const mi_registry = require('./routes/mi_registry.js')

const app = express()
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.text())
app.use(bodyParser.json({type: 'application/json'}))

mongoose.connect(config.db.uri, config.db.options)

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
app.route('/mcalc')
	.get(mcalc.getCalc)
	.post(mcalc.calculate)
app.route('/mi_registry')
	.get(mi_registry.readRecords)
	.post(mi_registry.searchRecords)

app.listen(config.app.port, () => {
	console.log(`App started at port: ${config.app.port}`)
})

// for testing app
module.exports = app
