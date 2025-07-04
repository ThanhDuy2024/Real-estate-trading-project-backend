import { Request, Response } from "express"
import { Category } from "../../models/category.model";
export const categoryCreate = async (req: Request, res: Response) => {
  if(req.file) {
    req.body.image = req.file.path;
  } else {
    delete req.body.image;
  }
  const newRecord = new Category(req.body); 
  await newRecord.save();
  res.json({
    code: "success",
    message: "Tạo danh mục thành công"
  });
}