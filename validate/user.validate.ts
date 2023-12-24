import { Request, Response, NextFunction } from "express";

// Define an interface that extends the 'Request' object to include the 'body' property
interface RequestWithBody extends Request {
  body: {
    email: string;
    password: string;
    fullName: string;
    confirmPassword?: string;
  };
}

const isValidEmail = (email: string): boolean => {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const registerPost = async (req: RequestWithBody, res: Response, next: NextFunction): Promise<void> => {
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

export const forgotPasswordPost = async (req: Request, res: Response, next: NextFunction) => {
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

export const loginPost = async (req: Request, res: Response, next: NextFunction) => {
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

export const resetPasswordPost = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.password) {
    res.json({
      code: 400,
      message: "Password must not be empty"
    })
    return;
  }

  if (!req.body.confirmPassword) {
    res.json({
      code: 400,
      message: "Password did not confirmed"
    })
    return;
  }

  if (req.body.confirmPassword != req.body.password) {
    res.json({
      code: 400,
      message: "Password confirm does not match"
    })
    return;
  }

  next();
};

