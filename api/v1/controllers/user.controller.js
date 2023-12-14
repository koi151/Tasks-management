const User = require('../model/user.model');
const ForgotPassword = require('../model/forgot-password.model');

const generateHelper = require('../../../helpers/generateString');
const sendMailHelper = require('../../../helpers/sendMail');
const bcrypt = require('bcrypt');

// [POST] /api/v1/user/register
module.exports.registerPost = async (req, res) => {
  try {
    let { fullName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existedEmail = await User.findOne({
      email: email,
      deleted: false
    })

    if (!existedEmail) {
      const newUser = new User({
        fullName: fullName, 
        email: email,
        password: hashedPassword,
      })
      await newUser.save();

      const token = newUser.token;
      res.cookie("token", token);

      res.json({
        code: 200,
        message: 'New user account created successfully',
        token: token
      })

    } else {
      res.json({
        code: 409,
        message: 'Error occurred, email has been used'
      })
    }

  } catch (error) {
    console.log('Error occurred:', error);
    res.json({
      code: 400,
      message: 'Not existed'
    })
  }
}

// [POST] /api/v1/user/login
module.exports.loginPost = async (req, res) => {
  try {
    const existedUser = await User.findOne({
      email: req.body.email,
      deleted: false
    });

    if (!existedUser) {
      res.json({
        code: 400,
        message: 'Incorrect email or password'
      })
      return;
    }

    const passwordMatched =  bcrypt.compare(req.body.password, existedUser.password);
    if (passwordMatched) {
      const token = existedUser.token;
      res.cookie('token', token);

      res.json({
        code: 200,
        message: 'Login successful',
        token: token
      })  
    } else {
      res.json({
        code: 400,
        message: 'Incorrect email or password'
      })
    }      
    
  } catch (error) {
    console.log('Error occurred:', error);
    res.json({
      code: 400,
      message: 'Not existed'
    })
  }
}

// [POST] /api/v1/user/login/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  try {
    const email = req.body.email;
    
    const emailExisted = await User.findOne({
      email: email,
      deleted: false
    })

    if (!emailExisted) {
      res.json({
        code: 400,
        message: 'Email not existed'
      })
      return;
    }

    const otp = generateHelper.generateRandomNumber(6);
    const expiredTime = 5;

    const forgotPasswordObj = {
      email: email,
      otp: otp,
      expireAt: Date.now() + expiredTime * 60
    }

    const forgotPassword = new ForgotPassword(forgotPasswordObj);
    await forgotPassword.save();

    // Send OTP code to gmail of user
    const subject = 'OTP verification code for retriving password'
    const content = `
      <p>Your OTP verification code is <b>${otp}</b></p>
      <p>OTP code expires in 2 minutes, do not share the code.</p>
    `

    sendMailHelper.sendMail(email, subject, content);

    res.json({
      code: 200,
      message: 'OTP code sent via email '
    })

  } catch (error) {
    console.log('Error occurred:', error);
    res.json({
      code: 400,
      message: 'Not existed'
    })
  }
}

// [POST] /api/v1/user/password/otp
module.exports.otpPassword = async (req, res) => {
  try {
    const result = await ForgotPassword.findOne({
      email: req.body.email,
      otp: req.body.otp
    })

    if (result) {
      const user = await User.findOne({
        email: req.body.email
      })

      const token = user.token;
      res.cookie("token", token);
      res.json({
        code: 200,
        message: 'OTP authencation successful',
        token: token
      })

    } else {
      res.json({
        code: 400,
        message: 'Invalid OTP'
      })
    }

  } catch (error) {
    console.log('Error occurred:', error);
    res.json({
      code: 400,
      message: 'Not existed'
    })
  }
}