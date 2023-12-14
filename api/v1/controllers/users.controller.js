const User = require('../model/users.model');

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