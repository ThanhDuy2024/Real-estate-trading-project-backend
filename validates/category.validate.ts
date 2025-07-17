import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const categoryValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required()
      .messages({
        "string.empty": "category name must have!",
        "string.max": "category name is only highest 50 characters!"
      }),
    status: Joi.string().required()
      .messages({
        "string.empty": "status must have!"
      }),
    image: Joi.allow(""),
    note: Joi.allow(""),
    parentId: Joi.allow(""),
    position: Joi.allow(""),
  });

  const { error } = schema.validate(req.body);

  if(error) {
    res.json({
      code: "error",
      message: error.details[0].message,
    });
    return;
  }
  next();
}