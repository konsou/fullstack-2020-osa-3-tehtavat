const mongoose = require('mongoose')

if (process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]


const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack-user:${password}@fullstack2020-bysw0.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (name === undefined) {
    // list persons
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => console.log(person.name, person.number))
        mongoose.connection.close()
    })

} else {
    // add given person
    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(response => {
        console.log(`added ${response.name} number ${response.number} to phonebook`)
        //console.log(response)
        mongoose.connection.close()
    })


}



