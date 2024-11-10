const api = require('express');
const router = api.Router();
const Joi = require("joi");
const { db } = require('../main');

const { FieldValue } = require('firebase-admin').firestore;

// PUT restock a product
router.put('/', async (req, res) => {
	const id = req.body.id;
	const quantity = req.body.quantity;

	// let nof_stock = 0, total_value = 0;
	
	try {
		// Get all products
		const productsSnapshot = await db.collection('products').doc(id)
		const doc = await productsSnapshot.get();
		if (!doc.exists) return res.status(400).send('Error: item doesnt exists');
		
		const productData = doc.data();

		productsSnapshot.update({
			current_stock: productData.current_stock + quantity,
		});

		res.status(201).send({ message: 'success', stock: productData.current_stock + quantity });
	} catch (error) {
		console.error('Error adding data:', error);
		res.status(500).send('Server Error');
	}
});

module.exports = router;