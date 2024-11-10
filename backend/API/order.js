const api = require('express');
const router = api.Router();
const Joi = require("joi");
const { db } = require('../main');

const { FieldValue } = require('firebase-admin').firestore;

// POST a list of products with quantity
router.post('/', async (req, res) => {
	const { user_id, products } = req.body;

	// Validate the input data
	const { error } = validateOrder(user_id, products);
	if (error) return res.status(400).send('Error: ' + error.details[0].message);

	try {
		// Step 1: Confirm that the user exists
		const userDoc = await db.collection('users').doc(user_id).get();
		if (!userDoc.exists) return res.status(400).send('Error: User does not exist');

		// Step 2: Calculate the total cost by fetching product prices
		let totalCost = 0;
		const quantity_list = [];
		for (let product of products) {
			const productDoc = await db.collection('products').doc(product.product_id).get();
			if (!productDoc.exists) return res.status(400).send(`Error: Product ${product.product_id} does not exist`);

			const productData = productDoc.data();

			if (productDoc.data().stock < product.quantity) return res.status(400).send(`Error: Not enough stock for product ${product.product_id}`);
			
			totalCost += productData.price * product.quantity; // Accumulate the cost for each product

			quantity_list.push({
				ref: db.collection('products').doc(product.product_id),
				updatedStock: productData.current_stock - product.quantity,
			});
		}

		totalCost += totalCost * 0.05; // Add 5% tax

		const batch = db.batch();
		for (const update of quantity_list) {
			batch.update(update.ref, { current_stock: update.updatedStock });
		}
		await batch.commit();

		// Step 3: Insert the new purchase into Firestore
		const purchaseData = {
			user_id,
			products,
			total: totalCost
		};
		const purchaseRef = await db.collection('purchases').add(purchaseData);

		await db.collection('users').doc(user_id).update({
			purchase_history_id: FieldValue.arrayUnion(purchaseRef.id),
		});
		
		// Respond with the new purchase ID and total cost
		return res.status(201).json({ success: true, purchase_id: purchaseRef.id, total: totalCost });
	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal Server Error');
	}
});

module.exports = router;

const validateOrder = (user_id, products) => {
	const schema = Joi.object({
		user_id: Joi.string().min(3).max(30).required(),
		products: Joi.array().items(
			Joi.object({
				product_id: Joi.string().min(3).max(30).required(),
				quantity: Joi.number().integer().min(1).required(),
			})
		).min(1).required(),
	});
	return schema.validate({ user_id, products });
}; 