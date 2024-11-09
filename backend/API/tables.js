const api = require('express');
const router = api.Router();

const Joi = require("joi");

var { data, db } = require('../main');

// GET /:table api to display a table
router.get('/:table', async (req, res) => { // TODO: recheck
	const table = req.params.table;

	const { error } = validate_table(table);
	if (error) return res.status(400).send('Error: ' + error.details[0].message);

	try {
		// Reference to the Firestore collection
		const collectionRef = db.collection(table);
		const snapshot = await collectionRef.get();
		if (snapshot.empty) return res.status(400).send('Error: No data found');

		// Extracting all documents in the collection
		const data = {};
		snapshot.forEach(doc => {
			data[doc.id] = { ...doc.data() };
		});

		res.send(data);
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).send('Server Error');
	}
});

// GET /:table/:id api to display a record in the tables
router.get('/:table/:id', async (req, res) => {
	const table = req.params.table;
	const id = req.params.id;

	try {
		// Check if document exists
		const docRef = db.collection(table).doc(id);
		const doc = await docRef.get();
		if (!doc.exists) return res.status(400).send('Error: document doesnt exists');

		res.status(201).send({ [id]: doc.data() });
	} catch (error) {
		console.error('Error adding data:', error);
		res.status(500).send('Server Error');
	}
});

// POST /:table/:id api to create record in the tables
router.post('/:table/:id', async (req, res) => {
	const table = req.params.table;
	const id = req.params.id;
	const new_item = req.body;

	const { error } = validate_table(table);
	if (error) return res.status(400).send('Error: ' + error.details[0].message);

	let validateInput;
	if (table === 'users') {
		validateInput = validate_input_users_schema;
	} else if (table === 'products') {
		validateInput = validate_input_products_schema;
	} else if (table === 'purchases') {
		validateInput = validate_input_purchases_schema;
	} else if (table === 'categories') {
		validateInput = validate_input_categories_schema;
	}

	const { error: inputError } = validateInput({ id: id, ...new_item });
	if (inputError) return res.status(400).send('Error: ' + inputError.details[0].message);

	try {
		// Check if document exists
		const docRef = db.collection(table).doc(id);
		const doc = await docRef.get();
		if (doc.exists) return res.status(400).send('Error: item already exists');

		delete new_item.id;

		// Add a new document
		await docRef.set(new_item);
		res.status(201).send({ [new_item.id]: new_item });
	} catch (error) {
		console.error('Error adding data:', error);
		res.status(500).send('Server Error');
	}
});

// PUT /:table/:id api to update record in the tables
router.put('/:table/:id', async (req, res) => {
	const table = req.params.table;
	const id = req.params.id;
	const update_item = req.body;

	const { error } = validate_table(table);
	if (error) return res.status(400).send('Error: ' + error.details[0].message);

	let validateInput;
	if (table === 'users') {
		validateInput = validate_input_users_schema;
	} else if (table === 'products') {
		validateInput = validate_input_products_schema;
	} else if (table === 'purchases') {
		validateInput = validate_input_purchases_schema;
	} else if (table === 'categories') {
		validateInput = validate_input_categories_schema;
	}

	const { error: inputError } = validateInput({ id: id, ...update_item });
	if (inputError) return res.status(400).send('Error: ' + inputError.details[0].message);

	try {
		// Check if document exists
		const docRef = db.collection(table).doc(id);
		const doc = await docRef.get();
		if (!doc.exists) return res.status(400).send('Error: item doesnt exists');

		delete update_item.id;

		// Update document in Firestore
		await docRef.update(update_item);
		res.status(201).send({ [id]: update_item });
	} catch (error) {
		console.error('Error adding data:', error);
		res.status(500).send('Server Error');
	}
});

// DELETE /:table/:id api to delete record in the tables
router.delete('/:table/:id', async (req, res) => {
	const table = req.params.table;
	const id = req.params.id;

	const { error } = validate_table(table);
	if (error) return res.status(400).send('Error: ' + error.details[0].message);

	let validateInput;
	if (table === 'users') {
		validateInput = validate_input_users_schema;
	} else if (table === 'products') {
		validateInput = validate_input_products_schema;
	} else if (table === 'purchases') {
		validateInput = validate_input_purchases_schema;
	} else if (table === 'categories') {
		validateInput = validate_input_categories_schema;
	}

	try {
		// Check if document exists
		const docRef = db.collection(table).doc(id);
		const doc = await docRef.get();
		if (!doc.exists) return res.status(400).send('Error: item doesnt exists');

		// Delete document from Firestore
		await docRef.delete();

		res.status(201).send({ [id]: doc.data() });
	} catch (error) {
		console.error('Error adding data:', error);
		res.status(500).send('Server Error');
	}
});

module.exports = router;


const validate_table = (data) => {
	const schema = Joi.string().valid('users', 'products', 'purchases', 'categories').required();
	return schema.validate(data);
}

const validate_input_users_schema = (data) => {
	const schema = Joi.object({
		id: Joi.string().length(8).pattern(/^user\d{4}$/).required(),
		name: Joi.string().max(20).required(),
		password: Joi.string().min(8).required(),
		role: Joi.string().valid('customers', 'inv_manager', 'sal_person', 'admin').required(),
	});
	return schema.validate(data);
}

const validate_input_products_schema = (data) => {
	const schema = Joi.object({
		id: Joi.string().length(7).pattern(/^pro\d{4}$/).required(),
		name: Joi.string().max(20).required(),
		price: Joi.number().min(0).required(),
		max_stock: Joi.number().min(0).required(),
		current_stock: Joi.number().min(0).required(),
		category_id: Joi.string().length(7).pattern(/^cat\d{4}$/).required(),
	});
	return schema.validate(data);
}

const validate_input_purchases_schema = (data) => {
	const schema = Joi.object({
		id: Joi.string().length(7).pattern(/^pur\d{4}$/).required(),
		user_id: Joi.string().length(8).pattern(/^user\d{4}$/).required(),
		products: Joi.array().items(Joi.object({
			product_id: Joi.string().length(7).pattern(/^pro\d{4}$/).required(),
			quantity: Joi.number().min(0).required(),
			// price: Joi.number().min(0).required(), // Is not needed as its calculated in the backend and price found in products
		})),
		total: 	Joi.number().min(0).required(),
	});
	return schema.validate(data);
}

const validate_input_categories_schema = (data) => {
	const schema = Joi.object({
		id: Joi.string().length(7).pattern(/^cat\d{4}$/).required(),
		name: Joi.string().max(20).required(),
		description: Joi.string().max(200).required(),
		product_id: Joi.array().items(Joi.string().length(7).pattern(/^pro\d{4}$/)),
	});
	return schema.validate(data);
}

/*
Example:
POST /api/products
{
    "id": "pro0002",
    "name": "Phone",
    "price": 500,
    "max_stock": 70,
    "current_stock": 20,
    "category_id": "cat0001"
}

POST /api/users
{
    "id": "user0002",
    "name": "Reno Jacob",
    "password": "password123",
    "role": "871263"
}

POST /api/categories
{
    "id": "cat0002",
    "name": "Clothing",
    "description": "Clothing and accessories",
    "product_id": ["pro0001", "pro0002"]
}

POST /api/purchases
{
    "id": "pur0002",
    "user_id": "user0001",
    "products": [
        {
            "product_id": "pro0001",
            "quantity": 3

*/