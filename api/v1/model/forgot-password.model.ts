import mongoose from 'mongoose'

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String, 
    otp: String,
    expireAt: {
      type: Date,
      expires: 0
    }
  },
  { timestamps: true }
)

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-password");

export default ForgotPassword;