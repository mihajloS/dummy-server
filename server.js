const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT || 8000
const contact = require('./contact/contact')
const mongoose = require('mongoose')
const config = require('config').db

mongoose.connect(config.dbUri, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Db error:'))
db.on('open', ()=>{
    console.log(`Db connection success [${config.description}]`)
    app.emit('appStarted')
})

const allowCrossDomain = function(req, res, next) {
    const allowedOrigins = ['http://www.mihajlosupic.com', "http://www.mihajlosupic.com"]
    for(var i=0;i<allowedOrigins.length;i++){
      var origin = allowedOrigins[i];
      if(req.headers.origin.indexOf(origin) > -1){
           res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
           return;
      }
  }
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);

app.use(express.json()) // for parsing application/json
app.use(morgan('dev')) // for loging requests

app.get('/', (req, res) => { res.send('Index page') })

app.route('/contact_mihajlo').post(contact.emailToMihajlo)

app.listen(PORT, () => { console.log(`App listening on port ${PORT}`) })

module.exports = app // for testing