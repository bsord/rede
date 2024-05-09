const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Ensure email is unique
  },
  password: {
    type: String,
    select: false,  // Do not include by default in queries
  },
  numericCode: {
    type: Number,
    select: false,  // Do not include by default in queries
  },
  numericCodeExpiry: {
    type: Date,
    select: false,  // Do not include by default in queries
  },
  codeSecret: {
    type: String,
    select: false,  // Do not include by default in queries
  },
});

UserSchema.pre('save', async function (next) {
  try {
    const user = this;
    if (!user.isModified('password')) return next();
    
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);