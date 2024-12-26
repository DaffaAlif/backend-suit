const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_id: { type: Number, unique: true }, // Integer ID
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar_id: { type: Number },
  created_at: { type: Date, default: Date.now },
});

// Pre-save hook to auto-increment user_id
UserSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  const User = mongoose.model('User', UserSchema);
  const lastUser = await User.findOne().sort({ user_id: -1 }); // Find the user with the highest user_id
  this.user_id = lastUser ? lastUser.user_id + 1 : 1; // Increment or start with 1
  next();
});

module.exports = mongoose.model('User', UserSchema);
