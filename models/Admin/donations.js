const mongoose = require('mongoose')

const donationSchema = new mongoose.Schema({
    fullName: { type: String },
    gender: { type: String },
    age: { type: Number },
    district: { type: String },
    branch: { type: String },
    bloodGroup: { type: String },
    unit: { type: Number },
    disease: { type: String },
    donatedDate: { type: String },
    status: { type: String },
    userId: { type: String }
})

const Donations = mongoose.model("donations", donationSchema)

module.exports = { Donations }