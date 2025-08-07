import { Response } from "express";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
import { Role } from "../../models/roles.model";
export const profile = async (req: accountAdmin, res: Response) => {
  const dataFinal: any = {
    id: req.accountAdmin._id,
    fullName: req.accountAdmin.fullName,
    email: req.accountAdmin.email,
    avatar: req.accountAdmin.avatar ? req.accountAdmin.avatar : "",
    phone: req.accountAdmin.phone ? req.accountAdmin.phone : "",
    address: req.accountAdmin.address ? req.accountAdmin.address : "",
    roleInfor: ""
  }

  const roleQuery = await Role.findOne({
    _id: req.accountAdmin.roleId,
    deleted: false
  })

  if (roleQuery) {
    dataFinal.roleInfor = {
      roleId: req.accountAdmin.roleId,
      roleName: roleQuery.name
    }
  } else {
    dataFinal.roleInfor = {
      roleId: "",
      roleName: ""
    }
  }

  res.json({
    code: "success",
    profile: dataFinal
  })
}