import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import AccountAdmin from "../../models/accountAdmin.model";
import jwt from "jsonwebtoken";
export const registerAdmin = async (req: Request, res: Response) => {
  const findEmail = await AccountAdmin.findOne({
    email: req.body.email
  });

  if(findEmail) {
    res.status(400).json({
      code: "error",
      message: "Email đã tồn tại"
    })
    return;
  }


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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const findEmail = await AccountAdmin.findOne({
      email: email
    });

    if (!findEmail) {
      res.status(404).json({
        code: "error",
        message: "Tài khoản của bạn không tồn tại"
      });
      return;
    }

    const checkPassword = await bcrypt.compare(password, String(findEmail.password));

    if (!checkPassword) {
      res.status(404).json({
        code: "error",
        message: "Tài khoản của bạn không tồn tại"
      });
      return;
    }

    const token = jwt.sign({
      id: findEmail.id,
      email: findEmail.email,
      fullName: findEmail.fullName
    }, String(process.env.JWT_KEY),  {
      expiresIn: 30 * 24 * 60 * 60 * 1000
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, //true: https or false: http
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    
    res.json({
      code: "success",
      message: "Đăng nhập thành công"
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      code: "error",
      message: "Tài khoản của bạn không tồn tại"
    })
  }
}