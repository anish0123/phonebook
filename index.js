const express = require("express");
const morgan = require('morgan');
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));


app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  })
  )

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/persons", (request, response) => {
  response.send("<h1>This is api for CRUD persons list");
});

app.get("/api/persons", (request, response) => {
  console.log(persons);
  response.json(persons);
});

app.get("/info", (request, response) => {
  const date = new Date();
  console.log(date.toString());
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  const id = Math.floor(Math.random() * 10000);
  const body = request.body;
  const search = persons.find((p) => p.name === body.name);
  if (!body.name || !body.number) {
    response.status(404).json({
      error: "content missing",
    });
  } else {
    if (search) {
      response.status(404).json({
        error: "name must be unique",
      });
    } else {
      const person = {
        id: id,
        name: body.name,
        number: body.number,
      };
      persons = persons.concat(person);
      response.json(persons);
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server listening to ${PORT}`);
