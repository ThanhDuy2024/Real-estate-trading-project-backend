import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import AccountAdmin from "../../models/accountAdmin.model";
export const registerAdmin = async (req: Request, res: Response) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  req.body.password = hash;

  const newRecord = new AccountAdmin(req.body);

  await newRecord.save();
  res.json({  
    code: "success",
    message: "Đăng ký thành công",
  });
}