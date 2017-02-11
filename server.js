const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const db = require('./config/db.js');

const app = express();

const PORT = process.env.PORT || 3030;

app.use(bodyParser.urlencoded({extended: true}));

// static directory
app.use(express.static('app/public'));

MongoClient.connect(db.url, (err, database) => {
	if (err) return console.log(err);
	require('./app/routes')(app, database);

	app.listen(PORT, () => {
		console.log('App running on port ' + PORT )
	})
})

// require('./app/routes')(app, {});
// app.listen(PORT, () => {
// 	console.log("App running on port: " + PORT);
// });

