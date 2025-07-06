import { Request, Response } from "express"
import { Category } from "../../models/category.model";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
export const categoryCreate = async (req: accountAdmin, res: Response) => {
  if(req.file) {
    req.body.image = req.file.path;
  } else {
    delete req.body.image;
  }
  req.body.updatedBy = req.accountAdmin._id;
  req.body.createbBy = req.accountAdmin._id;
  req.body.parentId = JSON.parse(req.body.parentIdArray);
  const newRecord = new Category(req.body);
  await newRecord.save();
  res.json({
    code: "success",
    message: "Tạo danh mục thành công"
  });
}