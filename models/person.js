const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true) // get rid of deprecation warning
const uniqueValidator = require('mongoose-unique-validator')

if (process.env.NODE_ENV !== 'production'){
    const dotenv = require('dotenv')
    dotenv.config()
}

const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fullstack2020-bysw0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })


const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 100
    },
    number: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100
    }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
