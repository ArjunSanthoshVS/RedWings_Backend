const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: true
    }
})

adminSchema.methods.generateAdminToken = function () {
    const token = jwt.sign({ _id: this._id }, 'REDWINGSADMIN', { expiresIn: '7d' })
    return token
}

const Admin = mongoose.model("admin", adminSchema)

module.exports = { Admin }