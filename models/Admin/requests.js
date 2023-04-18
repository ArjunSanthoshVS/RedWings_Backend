const mongoose = require('mongoose')

const transfusionSchema = new mongoose.Schema({
    fullName: { type: String },
    gender: { type: String },
    age: { type: Number },
    district: { type: String },
    branch: { type: String },
    bloodGroup: { type: String },
    unit: { type: Number },
    reason: { type: String },
    receivedDate: { type: String },
    status: { type: String },
    userId: { type: String }
})

const Requests = mongoose.model("requests", transfusionSchema)

module.exports = { Requests }   