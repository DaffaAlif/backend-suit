const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar_id: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
