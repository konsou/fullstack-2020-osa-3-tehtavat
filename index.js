if (process.env.NODE_ENV !== 'production'){
    const dotenv = require('dotenv')
    dotenv.config()
}

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')
const ObjectId = require('mongodb').ObjectID;

morgan.token('body', request => {
    if (Object.keys(request.body).length > 0) {
        return JSON.stringify(request.body)
    } else {
        return ""
    }
})

app.use(express.json())
app.use(morgan(':method :url :status :body :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))


app.get('/info', (request, response, next) => {
    //console.log(`GET info`)
    Person.countDocuments({})
        .then((count) => {
            const body = `<p>Phonebook has ${count} persons</p>
            <p>${new Date().toString()}</p>`
            response.send(body)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
    // console.log(`GET persons`)
    Person.find({})
        .then((persons) => {
            response.json(persons)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    //console.log(`GET person ${id}`)
    Person.findById(id)
        .then((person) => {
            if (person){
                console.log(person)
                response.json(person)            
            } else {
                response.status(404).send()
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    //console.log(`POST person`)
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'Missing name'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'Missing number'
        })
    }

    console.log('checking for duplicates...')

    // check for duplicate
    Person.findOne({ name: body.name })
        .then(duplicatePerson =>{
            if (duplicatePerson !== null) {
                console.log(`${body.name} already exists`)
                console.log(duplicatePerson)
                return response.status(400).json({
                    error: `${body.name} already exists - name must be unique`
                })
            } else {
                // no duplicate found
                console.log('duplicate check passed')
                const person = new Person({
                    name: body.name,
                    number: body.number
                })
            
                person.save().then(savedPerson => {
                    console.log('saved', savedPerson.name)
                    response.json(savedPerson)
                })  
                // error saving person
                .catch(error => next(error))
            }
        })
        // error checking for duplpicates (eg. no internet connection)
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    //console.log(request)
    const id = request.params.id
    const body = request.body
    const updatedPerson = {
        id: id,
        name: body.name,
        number: body.number
    }

    // console.log(`PUT request for ${id}`)
    //console.log(body)
    //console.log(updatedPerson)
    Person.replaceOne(
        { name: body.name }, 
        updatedPerson)
            .then(response2 => {
                
                //console.log(response2)
                if (response2.nModified){
                    console.log('updated person')
                    response.json(updatedPerson)
                } else {
                    console.log('didn\'t update person')
                    response.status(500).send()
                }
                
            })
            .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    // console.log(`DELETE person ${id}`)
    Person.deleteOne({ "_id": ObjectId(id) })
        .then(response2 => {
            console.log(`deleted ${response2.deletedCount} persons`)
            response2.deletedCount
                ? response.status(204).send()
                : response.status(404).send()
        })
        // malformatted id
        .catch(error => next(error))
})

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error('ERROR CAUGHT BY HANDLER:')
    console.error(`${error.name}: ${error.message}`)
    //console.error(error.message)

    if (error.name === 'CastError'){
        return response.status(400).send({ error: 'malformatted id'})
    } else if (error.name === 'MongooseServerSelectionError'){
        return response.status(500).send({ error: 'couldn\'t connect to Mongoose server'})
    } else {
        return response.status(500).send({ error: 'generic error'})
    }
}

app.use(errorHandler)


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})