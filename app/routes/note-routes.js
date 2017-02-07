module.exports = function(app, db) {
	var ObjectID = require('mongodb').ObjectID;
	app.get('/notes/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id': new ObjectID(id)}
		db.collection('notes').findOne(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		})
	});

	app.post('/notes', (req, res) => {
		const note = {title: req.body.title, body: req.body.main};
		db.collection('notes').insert(note, (err, result) => {
			if (err) {
				res.send( {'error': 'An error has occured'});
			} else {
				res.send(result.ops[0]);
			}
		});
	});

	app.delete('/notes/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id': new ObjectID(id)};
		db.collection('notes').remove(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});j
			} else {
				res.send('Note ' + id + ' deleted');
			}
		});
	});

	app.put('/notes/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id': new ObjectID(id)};
		const note = {text: req.body.text, title: req.body.title};
		db.collection('notes').update(details, note, (err, result) => {
			if (err) {
				res.send({'error': 'An error has occured'});
			} else {
				res.send(note);
			}
 		});
	});
}