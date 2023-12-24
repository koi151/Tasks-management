import mongoose from 'mongoose'

const usersSchema = new mongoose.Schema(
  {
    fullName: String, 
    email: String,
    password: String,
    token: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  { timestamps: true }
)

const Users = mongoose.model("Users", usersSchema, 'users');

export default Users;