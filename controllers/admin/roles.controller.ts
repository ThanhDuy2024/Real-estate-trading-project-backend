import { Request, Response } from "express";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
import { Role } from "../../models/roles.model";

export const roleCreate = async (req: accountAdmin, res: Response) => {
  req.body.createdBy = req.accountAdmin._id;
  req.body.updatedBy = req.accountAdmin._id;

  const newRecord = new Role(req.body);
  await newRecord.save();
  res.json({
    code: "success",
    message: "Role created successfully"
  });
}