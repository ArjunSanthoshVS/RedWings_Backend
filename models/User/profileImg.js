const mongoose = require('mongoose')
const imgSchema = new mongoose.Schema({
    name: String,
    img: {
        data: Buffer,
        contentType: String
    }
})


module.exports = ProfileImage = mongoose.model("profileImage", imgSchema);
