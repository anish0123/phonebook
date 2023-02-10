const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));


app.use(morgan((tokens, req,res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
      ].join(' ')
}));

let phoneBook = [
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

app.get("/api/persons", (request, response) => {
  response.json(phoneBook);
});

app.get("/info", (request, response) => {
  let date = new Date();
  response.send(`
    <h1> Phonebook has info for ${phoneBook.length} people.</h1>
    <p> ${date} </p>
    `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const phoneNumber = phoneBook.find((givenNumber) => givenNumber.id === id);

  phoneNumber ? response.json(phoneNumber) : response.sendStatus(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phoneBook = phoneBook.filter((deleteNumber) => deleteNumber.id !== id);
  response.json(phoneBook);
});

app.post("/api/persons", (request, response) => {
  const id = Math.floor(Math.random() * 10000);
  const body = request.body;

  if (!body.name) {
    response.status(400).json({
      error: "name of the contact missing",
    });
  } else if (!body.number) {
    response.status(400).json({
      error: "number of the contact missing",
    });
  } else if (phoneBook.find((contact) => contact.name === body.name)) {
    response.status(422).json({
      error: "name must be unique",
    });
  }

  const newNumber = {
    id: id,
    name: body.name,
    number: body.number,
  };
  phoneBook = phoneBook.concat(newNumber);
  response.json(newNumber);
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
