const api = require('express');
const router = api.Router();
const Joi = require("joi");
const { db } = require('../main');

// POST route for adding a new user
router.post('/signin', async (req, res) => {
	const { name, password, role } = req.body;

	// Validate new user data
	const { error } = validateCredentials(name, password, role);
	if (error) return res.status(400).send('Error: ' + error.details[0].message);

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
			role: "customer",
			purchase_history_id: []
		};

		const docRef = await usersCollection.add(newUser);
		return res.status(201).json({ success: true, role: "customer", user_id: docRef.id });
	} catch (err) {
		console.error(err);
		return res.status(500).send('Internal Server Error');
	}
});

// GET route for logging in an existing user
router.post('/login', async (req, res) => {
	const name = req.body.name;
	const password = req.body.password;

	// Validate credentials
	const { error } = validateCredentials(name, password);
	if (error) return res.status(400).send('Error: ' + error.details[0].message);

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