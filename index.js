const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', request => {
    if (Object.keys(request.body).length > 0) {
        return JSON.stringify(request.body)
    } else {
        return ""
    }
})

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: 'Unknown endpoint' })
}

app.use(express.json())
app.use(morgan(':method :url :status :body :res[content-length] - :response-time ms'))
app.use(cors())


let persons = 
    [
      {
        "name": "Perkki Antinheimo",
        "number": "123",
        "id": 1
      },
      {
        "name": "ZZZygyzy Xergez",
        "number": "201211hff",
        "id": 4
      },
      {
        "name": "Jussi",
        "number": "999",
        "id": 6
      },
      {
        "name": "Päntti",
        "number": "73 523",
        "id": 7
      }
    ]

const generateId = () => {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}    

app.get('/info', (request, response) => {
    //console.log(`GET info`)
    const body = `<p>Phonebook has ${persons.length} persons</p>
    <p>${new Date().toString()}</p>`
    response.send(body)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    //console.log(`GET person ${id}`)
    const person = persons.find(person => person.id === id)
    console.log(person)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
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

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: `${body.name} already exists - name must be unique`
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    console.log(person)

    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    // console.log(`DELETE person ${id}`)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.get('/api/persons', (request, response) => {
    // console.log(`GET persons`)
    response.json(persons)
})

app.use(unknownEndpoint)

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})