import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AccountAdmin from "../models/accountAdmin.model";
import { accountAdmin } from "../interfaces/accountAdmin.interface";

export const accountVerify = async (req: accountAdmin, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if(!token) {
      res.status(404).json({
        code: "error",
        message: "You must login to use this feature!"
      })
      return;
    }

    const decode = jwt.verify(token, String(process.env.JWT_KEY)) as JwtPayload;
    if(!decode) {
      res.clearCookie(token);
      res.status(404).json({
        code: "error"
      });
      return;
    }

    const record = await AccountAdmin.findOne({
      email: decode.email,
      deleted: false
    });

    if(!record) {
      res.clearCookie(token);
      res.status(404).json({
        code: "error"
      });
      return;
    }

    req.accountAdmin = record;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: "error"
    })
  }
}