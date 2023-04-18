const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
        unique: true,
        required: false
    },
    id: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    mobile: {
        type: String
    },
    bloodGroup: {
        type: String,
    },
    weight: {
        type: Number,
    },
    age: {
        type: Number,
    },
    question: {
        type: String,
    },
    gender: {
        type: String,
    },
    district: {
        type: String,
    },
    image: {
        type: String
    },
})

// userSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign({ _id: this._id }, 'REDWINGSUSER', { expiresIn: '7d' })
//     return token
// }

const User = mongoose.model("user", userSchema)

module.exports = { User }