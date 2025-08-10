import { Response } from "express";
import bcrypt from "bcryptjs"
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
import AccountAdmin from "../../models/accountAdmin.model";

export const accountAdminCreate = async (req: accountAdmin, res: Response) => {
  if(req.file) {
    req.body.avatar = req.file.path;
  } else {
    delete req.body.avatar;
  };

  const checkAccountExisted = await AccountAdmin.findOne({
    email: req.body.email,
  });

  if(checkAccountExisted) {
    res.json({
      code: "error",
      message: "Email your account has been existed!"
    });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(String(req.body.password), salt);

  req.body.password = hash;

  const newAccount = new AccountAdmin(req.body);
  newAccount.save();
  res.json({
    code: "success",
    message: "account has been created",
  })
}