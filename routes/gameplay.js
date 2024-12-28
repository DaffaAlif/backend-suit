const express = require('express');
const { createMatch, playRound, getMatchDetails , playRoundPVP} = require('../controllers/gameplayController'); // Import controller functions
const authenticateToken = require('../middleware/authenticateToken')


const router = express.Router();

router.post('/create-match',authenticateToken, createMatch);

router.post('/play-round',authenticateToken, playRound);
router.post('/play-round-pvp',authenticateToken, playRoundPVP);

router.get('/match/:match_id', authenticateToken, getMatchDetails);


module.exports = router;
