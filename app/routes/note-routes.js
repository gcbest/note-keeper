module.exports = function(app, db) {
	app.post('/notes', (req, res) => {
		console.log(req.body);

		const note = {title: req.body.title, body: req.body.main};
		db.collection.('notes').insert(note, (err, result) => {
			if (err) {
				res.send( {'error': 'An error has occured'});
			} else {
				res.send(result.ops[0]);
			}
		});
		res.send("Hello");
	});
}