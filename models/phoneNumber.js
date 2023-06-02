const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const url = process.env.MONGODB_URI;

mongoose.connect(url).then(result => {
    console.log('connected to mongodb')
})
.catch((error) => {
    console.log('could not connect to mongodb', error.message)
});

const phoneBookSchema = new mongoose.Schema ({
    name: String,
    number: String
})

phoneBookSchema.set('toJSON', {
    transform: (document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("PhoneNumber", phoneBookSchema)