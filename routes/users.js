const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/authController'); // Import controller functions
const authenticateToken = require('../middleware/authenticateToken')


const router = express.Router();

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', login);

router.get('/current-user', authenticateToken, getCurrentUser);


module.exports = router;
