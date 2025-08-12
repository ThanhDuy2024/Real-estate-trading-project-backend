import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const registerValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    fullName: Joi.string().min(6).max(50).required()
      .messages({
        "string.empty": "full name is not empty",
        "string.min": "full name must be at least 6 characters",
        "string.max": "full name must be at highest 50 characters"
      }),
    email: Joi.string().email().required()
      .messages({
        "string.empty": "email is not empty",
        "string.email": "email invalid",
      }),
    password: Joi.string().min(6).max(50).required()
      .messages({
        "string.empty": "password is not empty",
        "string.min": "password must be least 6 characters",
        "string.max": "password must be highest 50 characters",
      })
  })

  const { error } = schema.validate(req.body);

  if (error) {
    res.json({
      code: "error",
      message: error.details[0].message,
    })
    return;
  }

  next();
}

export const loginValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
      .messages({
        "string.empty": "email is empty",
        "string.email": "email invalid",
      }),
    password: Joi.string().min(6).max(50).required()
      .messages({
        "string.empty": "password is empty",
        "string.min": "password must be least 6 characters",
        "string.max": "password must be highest 50 characters",
      })
  })

  const { error } = schema.validate(req.body);

  if (error) {
    res.json({
      code: "error",
      message: error.details[0].message,
    })
    return;
  }

  next();
}

export const profileValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    id: Joi.string().required()
      .messages({
        "string.empty": "id is must have!",
      }),
    fullName: Joi.string().min(6).max(50).required()
      .messages({
        "string.empty": "full name is not empty",
        "string.min": "full name must be at least 6 characters",
        "string.max": "full name must be at highest 50 characters"
      }),
    email: Joi.string().email()
      .messages({
        "string.empty": "your email is empty",
        "string.email": "syntax email error"
      }),
    avatar: Joi.string().allow(""),
    phone: Joi.string().allow(""),
    address: Joi.string().allow(""),
    roleId: Joi.string().allow("")
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res.json({
      code: "error",
      message: error.details[0].message,
    });
    return;
  }
  next();
}

export const accountManagerValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    fullName: Joi.string().min(6).max(50).required()
      .messages({
        "string.empty": "full name is not empty",
        "string.min": "full name must be at least 6 characters",
        "string.max": "full name must be at highest 50 characters"
      }),
    email: Joi.string().email()
      .messages({
        "string.empty": "your email is empty",
        "string.email": "syntax email error"
      }),
    password: Joi.string().min(6).max(50).required()
      .messages({
        "string.empty": "password is empty",
        "string.min": "password must be least 6 characters",
        "string.max": "password must be highest 50 characters",
      }),
    avatar: Joi.string().allow(""),
    phone: Joi.string().allow(""),
    address: Joi.string().allow(""),
    roleId: Joi.string().allow("")
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res.json({
      code: "error",
      message: error.details[0].message,
    });
    return;
  }
  next();
}

export const accountManagerEditValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    fullName: Joi.string().min(6).max(50).required()
      .messages({
        "string.empty": "full name is not empty",
        "string.min": "full name must be at least 6 characters",
        "string.max": "full name must be at highest 50 characters"
      }),
    email: Joi.string().email()
      .messages({
        "string.empty": "your email is empty",
        "string.email": "syntax email error"
      }),
    avatar: Joi.string().allow(""),
    phone: Joi.string().allow(""),
    address: Joi.string().allow(""),
    roleId: Joi.string().allow("")
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res.json({
      code: "error",
      message: error.details[0].message,
    });
    return;
  }
  next();
}