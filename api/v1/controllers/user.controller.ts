import { Request, Response } from 'express';

import User from '../model/user.model';
import ForgotPassword from '../model/forgot-password.model';

import { generateRandomString, generateRandomNumber } from '../../../helpers/generateString';
import { sendMailHelper } from '../../../helpers/sendMail';
import bcrypt from 'bcrypt';

// [POST] /api/v1/user/register
export const registerPost = async (req: Request, res: Response) => {
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
        token: generateRandomString(30)
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
export const loginPost = async (req: Request, res: Response) => {
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

    const passwordMatched = await bcrypt.compare(req.body.password, existedUser.password);

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
export const forgotPasswordPost = async (req: Request, res: Response) => {
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

    const otp = generateRandomNumber(6);
    const expiredTime = 5;

    const forgotPasswordObj = {
      email: email,
      otp: otp,
      expireAt: Date.now() + expiredTime * 60 * 1000
    }

    const forgotPassword = new ForgotPassword(forgotPasswordObj);
    await forgotPassword.save();

    // Send OTP code to gmail of user
    const subject = 'OTP verification code for retriving password'
    const content = `
      <p>Your OTP verification code is <b>${otp}</b></p>
      <p>OTP code expires in 2 minutes, do not share the code.</p>
    `

    sendMailHelper(email, subject, content);

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
export const otpPassword = async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;
    const otp: string = req.body.otp;

    const result = await ForgotPassword.findOne({
      email: email,
      otp: otp
    })

    if (result) {
      const user = await User.findOne({
        email: email
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


// [POST] /api/v1/user/password/reset
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const token: string = req.body.token;
    const password: string = req.body.password;

    const user = await User.findOne({
      token: token,
    })
    
    const passwordMatched = bcrypt.compare(password, user.password);

    if (passwordMatched) {
      res.json({
        code: 400,
        message: 'New password must be different from old password'
      })
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.updateOne({
      token: token
    }, {
      password: hashedPassword
    })

    res.json({
      code: 200,
      message: 'New password updated successfully'
    })

  } catch (error) {
    console.log('Error occurred:', error);
    res.json({
      code: 400,
      message: 'Not existed'
    })
  }
}

// [GET] /api/v1/user/detail
export const detail = async (req: Request, res: Response) => {
  try {
    res.json({
      code: 200,
      message: 'User info sent successfully',
      info: req["user"]
    })

  } catch (error) {
    console.log('Error occurred: ', error);
    res.json({
      code: 400,
      message: 'Not existed'
    })
  }
}

// [GET] /api/v1/user/user-list
export const userList = async (req: Request, res: Response) => {
  try {
    const users = await User.find({
      deleted: false
    }).select('fullName email')

    res.json({
      code: 200,
      message: 'Successful!',
      users: users
    })

  } catch (error) {
    console.log('Error occurred: ', error);
    res.json({
      code: 400,
      message: 'Not existed'
    })
  }
}