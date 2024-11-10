const api = require('express');
const router = api.Router();
const Joi = require("joi");
const { db } = require('../main');

const { FieldValue } = require('firebase-admin').firestore;

// GET nof inventory stock, and total value of inventory
router.get('/', async (req, res) => {

	let nof_stock = 0, total_value = 0;
	
	try {
		// Get all products
		const productsSnapshot = await db.collection('products').get();

		productsSnapshot.forEach(doc => {
			nof_stock += doc.data().current_stock;
			total_value += doc.data().price * doc.data().current_stock;
		});

		res.status(201).send({ nof_stock, total_value });
	} catch (error) {
		console.error('Error adding data:', error);
		res.status(500).send('Server Error');
	}
});

module.exports = router;