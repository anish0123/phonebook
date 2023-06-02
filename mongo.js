const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('give password as an argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb://anishm007:${password}@ac-dttuehm-shard-00-00.hw5lsep.mongodb.net:27017,ac-dttuehm-shard-00-01.hw5lsep.mongodb.net:27017,ac-dttuehm-shard-00-02.hw5lsep.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-h1kr03-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)
const phoneBookSchema = ({
    name : String,
    number : String,
})
const PhoneNumber = mongoose.model('PhoneNumber', phoneBookSchema)

if(process.argv.length === 3) {
PhoneNumber.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(phoneNumber => {
        console.log(`${phoneNumber.name} ${phoneNumber.number}`)
    })
    mongoose.connection.close()
})

} else {
const phoneNumber = new PhoneNumber({
    name : process.argv[3],
    number : process.argv[4]
})

phoneNumber.save().then(result => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
})
}

