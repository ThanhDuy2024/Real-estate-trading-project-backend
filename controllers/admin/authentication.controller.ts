import { Response } from "express";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
export const profile = async (req: accountAdmin, res: Response) => {
  const dataFinal = {
    id: req.accountAdmin._id,
    fullName: req.accountAdmin.fullName,
    avatar: req.accountAdmin.avatar ? req.accountAdmin.avatar : "",
    phone: req.accountAdmin.phone ? req.accountAdmin.phone : "",
    address: req.accountAdmin.address ? req.accountAdmin.address : "",
    roleId: req.accountAdmin.roleId ? req.accountAdmin.roleId : "",
  }
  res.json({
    code: "success",
    profile: dataFinal
  })
}