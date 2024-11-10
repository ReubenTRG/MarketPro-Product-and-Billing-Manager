const express = require("express");
const api = express();

const cors = require("cors");

api.use(express.json());
api.use(cors());

const Joi = require("joi");

const admin = require("firebase-admin");
const serviceAccount = require("./firebase_config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com',
});

const db = admin.firestore();

// let test_data = {
// 	users: {
// 		"user0001": {
// 			name: "John Doe",
// 			password: "213bu13zn29n1",
// 			role: "customer", // "customer" or "admin" or "inventory manager"
// 			purchase_history_id: [
// 				"pur0001",
// 			],
// 		},
// 	},
// 	products: {
// 		"pro0001": {
// 			name: "Laptop",
// 			price: 1000,
// 			// img_url: "https://example.com/laptop.jpg", // need work
// 			max_stock: 50,
// 			current_stock: 25,
// 			category_id: "cat0001",
// 		}
// 	},
// 	purchases: { // order id
// 		"pur0001": {
// 			user_id: "user0001",
// 			products: [
// 				{ product_id: "pro0001", quantity: 2 },
// 				{ product_id: "pro0002", quantity: 1 }
// 			],
// 			total: 40
// 		}
// 	},
// 	categories: { // remove this later
// 		"cat0001": {
// 			name: "Electronics",
// 			description: "Devices and gadgets",
// 			product_id: ["pro0001", "pro0002"]
// 		}
// 	}
// };

module.exports = { db };	

const all_api = require('./API/all');
api.use('/api/tables', all_api);

const tables_api = require('./API/tables');
api.use('/api/tables', tables_api);

const login_api = require('./API/login');
api.use('/api', login_api);

const order_api = require('./API/order');
api.use('/api/order', order_api);

const inv_valuation_api = require('./API/inv_valuation');
api.use('/api/inv-valuation', inv_valuation_api);

const restock_api = require('./API/restock');
api.use('/api/restock', restock_api);

const port = process.env.PORT || 3000;
api.listen(port, () => {
	console.log(`Listening on port ${port}...\nlink: http://localhost:${port}`);
});