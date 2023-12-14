function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports.registerPost = async (req, res, next) => {
  if (!req.body.fullName) {
    res.json({
      code: 400,
      message: "Empty name"
    })
    return;
  }

  if (req.body.fullName.length < 5) {
    res.json({
      code: 400,
      message: "Full name must be at least 5 degits length"
    })
    return;
  }

  if (!req.body.email) {
    res.json({
      code: 400,
      message: "Empty email"
    })
    return;
  }

  if (!isValidEmail(req.body.email)) {
    res.json({
      code: 400,
      message: "Invalid email format"
    })
    return;
  }

  if (req.body.password.length < 6) {
    res.json({
      code: 400,
      message: "Pass word must be at least 5 degits length"
    })
    return;
  }

  next();
};


module.exports.loginPost = async (req, res, next) => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: "Empty email"
    })
    return;
  }

  if (!isValidEmail(req.body.email)) {
    res.json({
      code: 400,
      message: "Invalid email format"
    })
    return;
  }

  next();
};

// module.exports.forgotPasswordPost = async (req, res, next) => {
//   if (!req.body.email) {
//     req.flash('error', "Email must not be empty");
//     res.redirect('back');
//     return;
//   }

//   if (!isValidEmail(req.body.email)) {
//     req.flash('error', "Invalid email format");
//     res.redirect('back');
//     return;
//   }

//   next();
// };

// module.exports.resetPasswordPost = async (req, res, next) => {
//   if (!req.body.password) {
//     req.flash('error', "Password must not be empty");
//     res.redirect('back');
//     return;
//   }

//   if (!req.body.confirmPassword) {
//     req.flash('error', "Please confirm your password!");
//     res.redirect('back');
//     return;
//   }

//   if (req.body.confirmPassword != req.body.password) {
//     req.flash('error', "Password confirm does not match, please try again");
//     res.redirect('back');
//     return;
//   }

//   next();
// };
