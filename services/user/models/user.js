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
    unique: true,
  },
  password: {
    type: String,
    select: false,
  },
  numericCode: {
    type: Number,
    select: false,
  },
  numericCodeExpiry: {
    type: Date,
    select: false,
  },
  codeSecret: {
    type: String,
    select: false,
  },
  settings: {
    type: Object,
    select: true,
    default: {
      emailNotifications: true,
      darkMode: false,
      pendingActions: [{
        type: [Object],
      }]
    },
  }
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