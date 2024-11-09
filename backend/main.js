const express = require("express");
const api = express();
api.use(express.json());

const Joi = require("joi");

const admin = require("firebase-admin");
const serviceAccount = require("./firebase_config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com',
});

const db = admin.firestore();

let test_data = {
	users: {
		"user0001": {
			name: "John Doe",
			password: "213bu13zn29n1",
			role: "customer",
			purchase_history_id: [
				"pur0001",
			],
		},
	},
	products: {
		"pro0001": {
			name: "Laptop",
			price: 1000,
			// img_url: "https://example.com/laptop.jpg", // need work
			max_stock: 50,
			current_stock: 25,
			category_id: "cat0001",
		}
	},
	purchases: {
		"pur0001": {
			user_id: "user0001",
			products: [
				{ product_id: "pro0001", quantity: 2},
				{ product_id: "pro0002", quantity: 1}
			],
			total: 40
		}
	},
	categories: {
		"cat0001": {
			name: "Electronics",
			description: "Devices and gadgets",
			product_id: ["pro0001", "pro0002"]
		}
	}
};

module.exports = { data: test_data, db};	

const api_all = require('./API/all');
api.use('/api', api_all);

const tables_all = require('./API/tables');
api.use('/api', tables_all);

const login_all = require('./API/login');
api.use('/api', log)

// CRUD api for users



// api.get('/api/users/find/:userid', (req, res) => {
// 	const id = req.params.userid;

// 	const { error } = validate_userid(id);
// 	if (error) return res.status(400).send('Error: ' + error.details[0].message);

// 	const user = test_data.products[id];
// 	if (!user) return res.status(404).send('Error: Not found');

// 	res.send(user);
// });

// api.get('/api/users/find/name/:name', (req, res) => {
// 	const name = req.params.name;

// 	const { error } = validate_name(name);
// 	if (error) return res.status(400).send('Error: ' + error.details[0].message);

// 	const user = test_data.products.find((i) => i.name === name);
// 	if (!user) return res.status(404).send('Error: Not found');

// 	res.send(user);
// });

// // CRUD api for products

// api.get('/api/products/find/:proid', (req, res) => {
// 	const pid = req.params.proid;

// 	const { error } = validate_proid(pid);
// 	if (error) return res.status(400).send('Error: ' + error.details[0].message);

// 	const product = test_data.products[pid];
// 	if (!product) return res.status(404).send('Error: Not found');

// 	res.send(product);
// });

// api.get('/api/products/find/name/:name', (req, res) => {
// 	const name = req.params.name;

// 	const { error } = validate_name(name);
// 	if (error) return res.status(400).send('Error: ' + error.details[0].message);

// 	const product = test_data.products.find((i) => i.name === name);
// 	if (!product) return res.status(404).send('Error: Not found');

// 	res.send(product);
// });

const port = process.env.PORT || 3000;
api.listen(port, () => {
	console.log(`Listening on port ${port}...\nlink: http://localhost:${port}`);
});




// Validate functions with joi

function validate_userid(userid) {
	const schema = Joi.string().length(8).pattern(/^user\d{4}$/).required();
	return schema.validate(userid);
}

function validate_name(name) {
	const schema = Joi.string().min(3).required();
	return schema.validate(name);
}

function validate_proid(proid) {
	const schema = Joi.string().length(7).pattern(/^pro\d{4}$/).required();
	return schema.validate(proid);
}