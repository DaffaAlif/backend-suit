const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  player_one_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  player_two_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  player_one_scores: {
    type: Number,
    default: 0,
  },
  player_two_scores: {
    type: Number,
    default: 0,
  },
  winner_id: {
    type: String,
    ref: "User",
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Match = mongoose.model("Match", MatchSchema);

module.exports = Match
