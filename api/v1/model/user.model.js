const mongoose = require('mongoose')

const generate = require('../../../helpers/generateString');

const usersSchema = new mongoose.Schema(
  {
    fullName: String, 
    email: String,
    password: String,
    token: {
      type: String,
      default: generate.generateRandomString(30)
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  { timestamps: true }
)

const Users = mongoose.model("Users", usersSchema, 'users');

module.exports = Users;