import { Request, Response } from "express"
import { Category } from "../../models/category.model";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
import AccountAdmin from "../../models/accountAdmin.model";
import moment from "moment";
export const categoryCreate = async (req: accountAdmin, res: Response) => {
  if (req.file) {
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
};

export const categoryList = async (req: Request, res: Response) => {
  const dataFinal = [];
  const record = await Category.find({
    deleted: false
  });

  for (const item of record) {
    const rawData = {
      id: item.id,
      name: item.name,
      parentId: item.parentId,
      note: item.note,
      status: item.status,
      image: item.image ? item.image : "",
      updatedBy: "",
      createdBy: "",
      createdAt: "",
      updatedAt: "",
      slug: item.slug
    }

    if (item.updatedBy) {
      const account = await AccountAdmin.findOne({
        deleted: false,
        _id: item.updatedBy
      });
      if (!account) {
        rawData.updatedBy = "No person"
      } else {
        rawData.updatedBy = String(account.fullName);
      }
    }

    if (item.createdBy) {
      const account = await AccountAdmin.findOne({
        deleted: false,
        _id: item.createdBy
      });
      if (!account) {
        rawData.createdBy = "No person"
      } else {
        rawData.createdBy = String(account.fullName);
      }
    }

    if (item.createdAt) {
      const date = moment(item.createdAt).format("HH:mm - DD/MM/YYYY")
      rawData.createdAt = String(date);
    }

    if (item.updatedAt) {
      const date = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY")
      rawData.updatedAt = String(date);
    }

    dataFinal.push(rawData);
  }
  res.json({
    code: "success",
    data: dataFinal,
  })
}