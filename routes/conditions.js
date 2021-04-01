const pug = require('pug')
const mongoose = require('mongoose')
const Condition = require('../models/conditions.js')

const getConditions = (req, res) => {
	let content = pug.renderFile('./views/conditions.pug')
	res.render('index', {title: 'Условия микроклимата',
		header: 'Условия микроклимата',
		content: content})
}

const postCondition = async (req, res) => {
	console.log(req.body)
	let cond = new Condition(req.body)
	let message = ''
	// @@debug
	cond.save( (err, data) => {
		if (err) {
			message = 'Something is wrong!'
			console.log(err)
		} else {
			message = 'Data successfully added!'
		}
		res.json( {
			message: message,
			data: data,
		})
	})
}

const updateCondition = (req, res) => {

}

module.exports = { getConditions, postCondition, updateCondition }
