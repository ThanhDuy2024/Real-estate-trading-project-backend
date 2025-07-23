import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const roleValidate = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required()
      .messages({
        "string.empty": "Name must have!",
        "string.min": "Name must have at least 4 character!",
        "string.max": "Name must not exceed 50 characters!"
      }),
    permissions: Joi.string().allow(""),
    status: Joi.string().required()
      .messages({
        "string.empty": "status must have!"
      })
  })
  const { error } = schema.validate(req.body);
  
  if(error) {
    res.json({
      code: "error",
      message: error.details[0].message
    });
    return;
  }
  next();
}