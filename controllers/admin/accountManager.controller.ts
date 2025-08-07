import { Response } from "express";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";

export const accountAdminCreate = async (req: accountAdmin, res: Response) => {
  console.log(req.body);
  res.json({
    code: "success",
    message: "account has been created",
  })
}