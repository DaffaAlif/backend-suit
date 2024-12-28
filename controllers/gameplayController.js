const Match = require("../models/Match");
const Round = require("../models/Round");
const User = require("../models/User");

// Create a new match
exports.createMatch = async (req, res) => {
  const { player_one_id, player_two_id } = req.body;

  try {
    // Check if both players exist
    const playerOne = await User.findById(player_one_id);
    const playerTwo = await User.findById(player_two_id);
    if (!playerOne || !playerTwo) {
      return res.status(404).json({ message: "One or both players not found" });
    }

    // Create a new match
    const newMatch = new Match({
      player_one_id,
      player_two_id,
      player_one_scores: 0,
      player_two_scores: 0,
    });
    await newMatch.save();

    res
      .status(201)
      .json({ message: "Match created successfully", match: newMatch });
  } catch (error) {
    res.status(500).json({ message: "Error creating match", error });
  }
};

// Play a round
exports.playRound = async (req, res) => {
  const { match_id, player_one_move, player_two_move } = req.body;

  try {
    // Fetch the match
    const match = await Match.findById(match_id);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Determine the winner of the round
    const determineWinner = (move1, move2) => {
      if (move1 === move2) return 'Tie'; // Tie
      if (
        (move1 === "rock" && move2 === "scissors") ||
        (move1 === "scissors" && move2 === "paper") ||
        (move1 === "paper" && move2 === "rock")
      ) {
        return match.player_one_id;
      }
      return match.player_two_id;
    };

    const roundWinner = determineWinner(player_one_move, player_two_move);

    // Create a new round
    const newRound = new Round({
      match_id,
      player_one_id: match.player_one_id,
      player_two_id: match.player_two_id,
      player_one_move,
      player_two_move,
      round_winner_id: roundWinner,
    });
    await newRound.save();

    // Update match scores
    if (roundWinner === match.player_one_id) {
      match.player_one_scores += 1;
    } else if (roundWinner === match.player_two_id) {
      match.player_two_scores += 1;
    }

    //Update match winner id
    if (match.player_one_scores > match.player_two_scores) {
      match.winner_id = match.player_one_id;
    } else if (match.player_one_scores < match.player_two_scores) {
      match.winner_id = match.player_two_id;
    } else {
      match.winner_id = "tie";
    }

   
    await match.save();

    res.status(201).json({
      message: "Round played successfully",
      round: newRound,
      match,
    });
  } catch (error) {
    res.status(500).json({ message: "Error playing round", error });
  }
};

exports.getMatchDetails = async (req, res) => {
  const { match_id } = req.params;

  try {
    // Fetch match and rounds
    const match = await Match.findById(match_id);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    const round = await Round.find({ match_id });

    res.status(200).json({ match, round });
  } catch (error) {
    res.status(500).json({ message: "Error fetching match details", error });
  }
};
