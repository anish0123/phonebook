require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const PhoneBook = require("./models/phoneNumber");
const {default: mongoose} = require('mongoose');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

app.get("/persons", (request, response) => {
  response.send("<h1>This is api for CRUD persons list");
});

app.get("/api/persons", (request, response) => {
  PhoneBook.find({}).then(numbers => {
    response.json(numbers);
  });
});

app.get("/info", (request, response) => {
  const date = new Date();
  console.log(date.toString());
   PhoneBook.find({}).then(numbers => {
    response.send(`<p>Phonebook has info for ${numbers.length} people</p>
    <p>${date}`);
  });
});

app.get("/api/persons/:id", (request, response) => {
  PhoneBook.findById(request.params.id).then(number => {
    response.json(number)
  })
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    response.status(404).json({
      error: "content missing",
    });
  } else {
    const phoneBook = new PhoneBook({
      name : body.name,
      number : body.number
    })
    phoneBook.save().then(numbers =>
      response.json(numbers))

  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server listening to ${PORT}`);
