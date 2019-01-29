const emailService = require('./email_service.js')
// import validator from 'validator';
const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json()); // for parsing application/json

app.get('/', (req, res) => {
	console.log('/')
	res.send('Index page')

})

app.post('/contact_mihajlo', (req, res) => {

	// api is not checking for required filed
	// api has no tests

	console.log('contact mihajlo')
	console.log('req.body', req.body)
	const message = req.body.message
	const from = req.body.from
	const email_promise = emailService.sendEmail(from, message).then((response) => {
		res.send(`Email: ${!!response}`)
	})

})

app.listen(PORT, () => { console.log(`App listening on port ${PORT}`) })