const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Match = require("../models/Match");

exports.register = async (req, res) => {
  try {
    const { username, password, email, avatar_id } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Username, password, and email are required." });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Username or email already exists." });
    }

    const hash = bcrypt.hashSync(password, 10);

    const user = new User({
      username,
      password: hash,
      email,
      avatar_id: avatar_id || null,
      winstreak: 0 
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        avatar_id: user.avatar_id,
        winstreak: user.winstreak,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    bcrypt.compare(password, user.password).then((resBcrypt) => {
      // res === true
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "10h",
      });
      res
        .status(200)
        .json({ message: "Login successful", token, userId: user._id });
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, avatar_id, winstreak } = req.body;

    if (!username && !email && !avatar_id && !winstreak) {
      return res.status(400).json({
        error:
          "At least one field (username, email, avatar_id) must be provided.",
      });
    }

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (avatar_id) updates.avatar_id = avatar_id;
    if (winstreak) updates.winstreak = winstreak;

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error.", error });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the user from the database
    const user = await User.findById(userId).select("-password");
    const matches = await Match.find({
      $or: [{ player_one_id: userId }, { player_two_id: userId }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Initialize statistics
    const stats = { wins: 0, losses: 0, ties: 0 };

    matches.forEach((match) => {
      const { winner_id } = match;

      if (winner_id == "tie") {
        stats.ties += 1;
      } else if (winner_id == userId) {
        stats.wins += 1;
      } else if(winner_id !== null && winner_id !== userId) {
        stats.losses += 1;
      }
    });

    res.status(200).json({
      message: "Current user fetched successfully",
      user,
      stats,
      matches,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching current user",
      error,
    });
  }
};
