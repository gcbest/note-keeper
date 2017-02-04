const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

const PORT = process.env.PORT || 3030;

app.use(bodyParser.urlencoded({extended: true}));

require('./app/routes')(app, {});
app.listen(PORT, () => {
	console.log("App running on port: " + PORT);
}