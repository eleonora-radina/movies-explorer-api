const mongoose = require('mongoose');
const validator = require('validator');
const { invalidEmailMessage } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: invalidEmailMessage,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.methods.toJSON = function deletePassword() {
  const user = this.toObject();

  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
