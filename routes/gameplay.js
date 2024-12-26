const express = require('express');
const { createMatch, playRound, getMatchDetails } = require('../controllers/gameplayController'); // Import controller functions
const authenticateToken = require('../middleware/authenticateToken')

const router = express.Router();

router.post('/create-match',authenticateToken, createMatch);

router.post('/play-round',authenticateToken, playRound);

router.post('/match', authenticateToken, getMatchDetails);


module.exports = router;