const express = require('express');
const { register, login, getCurrentUser,updateUser } = require('../controllers/authController'); // Import controller functions
const authenticateToken = require('../middleware/authenticateToken')


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/update-user', authenticateToken, updateUser);
router.get('/current-user', authenticateToken, getCurrentUser);


module.exports = router;
