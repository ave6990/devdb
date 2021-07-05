import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import mongoose from 'mongoose'
import * as config from './config.js'
import * as fgis from './routes/fgis.js'
import * as upload_route from './routes/upload.js'
import * as ggs from './routes/ggs.js'
import * as conditions from './routes/conditions.js'
import * as mcalc from './routes/mcalc.js'
import * as mi_registry from './routes/mi_registry.js'

const app = express()
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.text())
app.use(bodyParser.json({type: 'application/json'}))

mongoose.connect(config.db.uri, config.db.options)

const urlencodedParser = bodyParser.urlencoded({extended: false})
const upload = multer({dest: 'uploads'})

//app.get('/', fgis.getMain)
app.get('/ggs', ggs.GGSCalc)
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
app.route('/')
	.get(mcalc.getCalc)
	.post(mcalc.calculate)
app.route('/mi_registry')
	.get(mi_registry.readRecords)
	.post(mi_registry.searchRecords)

app.listen(config.app.port, () => {
	console.log(`App started at port: ${config.app.port}`)
})

export { app }
