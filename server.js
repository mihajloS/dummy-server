const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT || 8000
const contact = require('./contact/contact')
const mongoose = require('mongoose')
const config = require('config')

mongoose.connect(config.db.dbUri, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Db error:'))
db.on('open', console.log.bind(console, 'Db connection success'))

app.use(express.json()) // for parsing application/json
app.use(morgan('dev')) // for loging requests

app.get('/', (req, res) => { res.send('Index page') })

app.route('/contact_mihajlo').post(contact.emailToMihajlo)

app.listen(PORT, () => { console.log(`App listening on port ${PORT}`) })