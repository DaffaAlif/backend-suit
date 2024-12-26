const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password, email, avatar_id } = req.body;

    // Validate input
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Username, password, and email are required." });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Username or email already exists." });
    }

    const hash = bcrypt.hashSync(password, 10);

    // Create a new user
    const user = new User({
      username,
      password: hash,
      email,
      avatar_id: avatar_id || null, // Optional avatar_id
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        avatar_id: user.avatar_id,
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

// Controller to get the current logged-in user
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user is set by the authenticateToken middleware
    const userId = req.user.id;

    // Fetch the user from the database
    const user = await User.findById(userId).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Current user fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching current user",
      error,
    });
  }
};
