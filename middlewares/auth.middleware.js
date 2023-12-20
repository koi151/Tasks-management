const User = require('../api/v1/model/user.model');

module.exports.authRequire = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];

      const user = await User.findOne({
        deleted: false, 
        token: token
      }).select('-password')

      if (!user) {
        res.json({
          code: 400,
          message: "Invalid token"
        })
      }

      req.user = user;
      next();

    } else {
      res.json({
        code: 400,
        message: "Please send with token"
      })
    }
  } catch (error) {
    console.log('Error occurred in authorization middleware:', error);
    res.json({
      code: 400,
      message: "Error occurred in while authorizating"
    })
  }
}