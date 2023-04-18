require('dotenv').config()
const mongoose = require('mongoose')

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

    try {
        mongoose.connect("mongodb+srv://Arjun_Santhosh:VJQmP0w2j0rezS19@redwings.ngtzzdg.mongodb.net/RedWings", connectionParams)
        console.log('Connected to database successfully.....');
    } catch (error) {
        console.log(error);
        console.log('Could not connected to database..');
    }
}   