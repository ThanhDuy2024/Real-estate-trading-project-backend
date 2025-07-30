import { Response } from "express";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
import { Category } from "../../models/category.model";
import Building from "../../models/building.model";

export const buildingCreate = async (req: accountAdmin, res: Response) => {
  if(req.file) {
    req.body.avatar = req.file.path;
  } else {
    delete req.body.avatar;
  };

  const categoryCheck = await Category.findOne({
    _id: req.body.categoryId,
    deleted: false,
  });

  if(!categoryCheck) {
    res.json({
      code: "error",
      message: "error, category not found!"
    });
    return;
  };

  if(req.body.numberOfFloors) {
    req.body.numberOfFloors = parseInt(req.body.numberOfFloors);
  };

  if(req.body.rentPrice) {
    req.body.rentPrice = parseInt(req.body.rentPrice);
  };

  if(req.body.purchasePrice) {
    req.body.purchasePrice = parseInt(req.body.purchasePrice);
  }

  req.body.createdBy = req.accountAdmin._id;
  req.body.updatedBy = req.accountAdmin._id;

  const newRecord = new Building(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Building created successfully"
  })
}