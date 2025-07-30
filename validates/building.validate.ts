import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const buildingValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required()
      .messages({
        "string.empty": "The building name is empty",
        "string.min": "The building name must be at least 5 character",
        "string.max": "The building name must be at most 50 character"
      }),
    avatar: Joi.allow(""),
    address: Joi.string().required().
      messages({
        "string.empty": "The building address is empty"
      }),
    categoryId: Joi.string().required()
      .messages({
        "string.empty": "The building's cateogryId is empty"
      }),
    acreage: Joi.string().required()
      .messages({
        "string.empty": "The building's areage is empty"
      }),
    numberOfFloors: Joi.allow(""),
    rentPrice: Joi.allow(""),
    purchasePrice: Joi.allow(""), 
    status: Joi.string().required()
      .messages({
        "string.empty": "The building status is empty"
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