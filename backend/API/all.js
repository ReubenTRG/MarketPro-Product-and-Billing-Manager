const api = require('express');
const router = api.Router();

var { db } = require('../main');

// GET /all api to display all the tables
router.get('/all', async (req, res) => {
	try {
		const collections = ['users', 'products', 'purchases', 'categories'];
		const temp_data = {};

		for (const table of collections) {
			const snapshot = await db.collection(table).get();
			temp_data[table] = {};

			snapshot.forEach((doc) => {
				temp_data[table][doc.id] = doc.data();
			});
		}

		res.send(temp_data);
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).send('Server Error');
	}
});

module.exports = router;