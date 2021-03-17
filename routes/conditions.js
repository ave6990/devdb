const pug = require('pug')
const mongoose = require('mongoose')
const cond = require('../models/conditions.js')

const read = (req, res) => {
	let content = pug.renderFile('./views/conditions.pug')
	res.render('index', {title: 'Условия микроклимата',
		header: 'Условия микроклимата',
		content: content})
}

const write = (req, res) => {

}

const update = (req, res) => {

}

module.exports = { read, write, update }
