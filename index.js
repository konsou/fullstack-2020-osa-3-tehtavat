const express = require('express')
const app = express()

app.use(express.json())

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
        const maxId = persons.length > 0
        ? Math.max(...persons.map(person => person.id))
        : 0
        return maxId + 1
    }    

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(`GET person ${id}`)
    const person = persons.find(person => person.id === id)
    console.log(person)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    console.log(`POST person`)
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'Missing name'
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
    console.log(`DELETE person ${id}`)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.get('/api/persons', (request, response) => {
    console.log(`GET persons`)
    response.json(persons)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})