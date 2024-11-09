const api = require('express');
const router = api.Router();
const Joi = require("joi");
const { data, db } = require('../main');

// POST route for adding a new user
router.post('/signin', async (req, res) => {
	const { name, password, role } = req.body;

	// Validate new user data
	const { error } = validateNewUser(name, password, role);
	if (error) return res.status(400).send('Invalid data format.');

	try {
		// Check if the user already exists
		const usersCollection = db.collection('users');
		const snapshot = await usersCollection.where('name', '==', name).get();

		if (!snapshot.empty) {
			return res.status(400).json({ success: false, message: 'User already exists' });
		}

		// Create new user document
		const newUser = {
			name,
			password, // For security, hash the password before storing
			role,
			purchase_history_id: []
		};

		const docRef = await usersCollection.add(newUser);
		return res.status(201).json({ success: true, message: 'User created', userId: docRef.id });
	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal Server Error');
	}
});

// GET route for logging in an existing user
router.get('/login', async (req, res) => {
	const name = req.query.name;
	const password = req.query.password;

	// Validate credentials
	const { error } = validateCredentials(name, password);
	if (error) return res.status(400).send('Invalid user name or password format.');

	try {
		// Query the collection to find a document with the matching name
		const usersCollection = db.collection('users');
		const snapshot = await usersCollection.where('name', '==', name).get();

		// Check if any user was found with the given name
		if (snapshot.empty) {
			return res.status(400).json({ success: false, message: 'User not found' });
		}

		let foundUser = null;

		// Iterate through each document to check the password
		snapshot.forEach(doc => {
			const user = doc.data();
			if (user.password === password) {
				foundUser = { ...user, id: doc.id }; // Capture user data if password matches
			}
		});

		if (foundUser) {
			// If a matching user was found, return success and the role
			return res.status(200).json({ success: true, role: foundUser.role });
		} else {
			// If no matching user or password is incorrect
			return res.status(400).json({ success: false, message: 'Invalid password' });
		}
	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal Server Error');
	}
});

module.exports = router;

// Validation function for login credentials
const validateCredentials = (name, password) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(30).required(),
		password: Joi.string().min(3).max(30).required(),
	});
	return schema.validate({ name, password });
};

// Validation function for new user data
const validateNewUser = (name, password, role) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(30).required(),
		password: Joi.string().min(3).max(30).required(),
		role: Joi.string().valid('customer', 'admin', 'sales manager').required()
	});
	return schema.validate({ name, password, role });
};
