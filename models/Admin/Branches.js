const mongoose = require('mongoose')

const BranchesSchema = new mongoose.Schema({
    district: { type: String, required: true },
    branch: { type: String, required: true },
    address: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
})

const Branches = mongoose.model("branches", BranchesSchema)

module.exports = { Branches }


