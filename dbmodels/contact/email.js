const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EmailSchema = new Schema({
    from: {type: String, required: true},
    message: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('email', EmailSchema)