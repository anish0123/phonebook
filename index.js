require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PhoneBook = require("./models/phoneNumber");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(cors());
app.use(express.json());
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
  PhoneBook.find({}).then((numbers) => {
    response.json(numbers);
  });
});

app.get("/info", (request, response) => {
  const date = new Date();
  console.log(date.toString());
  PhoneBook.find({}).then((numbers) => {
    response.send(`<p>Phonebook has info for ${numbers.length} people</p>
    <p>${date}`);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  PhoneBook.findById(request.params.id)
    .then((number) => {
      if (number) {
       response.json(number);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  PhoneBook.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    response.status(404).json({
      error: "content missing",
    });
  } else {
    const phoneBook = new PhoneBook({
      name: body.name,
      number: body.number,
    });
    phoneBook.save().then((numbers) => response.json(numbers));
  }
});

app.put("/api/persons/:id", (request, response, next) => {
  
  const body = request.body;
  console.log("🚀 ~ file: index.js:100 ~ app.put ~ body:", body)
  
  if (!body.name || !body.number) {
    response.status(404).json({
      error: "content missing",
    });
  } else {
    const phoneBook = {
      name: body.name,
      number: body.number,
    };
    console.log("🚀 ~ file: index.js:112 ~ app.put ~ request.params.id:", request.params.id)
   PhoneBook.findByIdAndUpdate(request.params.id, phoneBook, {new : true})
   .then(updatedNumber => {
    response.json(updatedNumber)
   })
   .catch(error => next(error))
  } 
})




app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server listening to ${PORT}`);
