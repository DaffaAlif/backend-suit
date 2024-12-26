const mongoose = require('mongoose');

const RoundSchema = new mongoose.Schema({
    match_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    player_one_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    player_two_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    player_one_move: {
        type: String,
        enum: ['rock', 'paper', 'scissors'],
        required: true
    },
    player_two_move: {
        type: String,
        enum: ['rock', 'paper', 'scissors'],
        required: true
    },
    round_winner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Round = mongoose.model('Round', RoundSchema);

module.exports = Round