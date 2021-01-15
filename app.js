const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'pug')

app.get('/', (req, res) => {
	res.render('index', {title: 'Hey', message: 'My test app!!! (ave6990)'})
})

app.get('/ggs', (req, res) => {
	res.render('ggs')
})

app.listen(port, () => {
	console.log('My first expirience.')
})
