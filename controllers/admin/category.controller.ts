import { Request, Response } from "express"
import { Category } from "../../models/category.model";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
export const categoryCreate = async (req: accountAdmin, res: Response) => {
  if(req.file) {
    req.body.image = req.file.path;
  } else {
    delete req.body.image;
  }
  console.log(req.accountAdmin);
  const newRecord = new Category(req.body);
  await newRecord.save();
  res.json({
    code: "success",
    message: "Tạo danh mục thành công"
  });
}