import { Response } from "express";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
import { Category } from "../../models/category.model";
import Building from "../../models/building.model";
import AccountAdmin from "../../models/accountAdmin.model";
import moment from "moment";

export const buildingCreate = async (req: accountAdmin, res: Response) => {
  if (req.file) {
    req.body.avatar = req.file.path;
  } else {
    delete req.body.avatar;
  };

  const categoryCheck = await Category.findOne({
    _id: req.body.categoryId,
    deleted: false,
  });

  if (!categoryCheck) {
    res.json({
      code: "error",
      message: "error, category not found!"
    });
    return;
  };

  if (!req.body.rentPrice && !req.body.purchasePrice) {
    res.json({
      code: "error",
      message: "The rent price or purchase price is empty"
    });
    return;
  }

  if (req.body.numberOfFloors) {
    req.body.numberOfFloors = parseInt(req.body.numberOfFloors);
  };

  if (req.body.rentPrice) {
    req.body.rentPrice = parseInt(req.body.rentPrice);
  };

  if (req.body.purchasePrice) {
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

export const buildingList = async (req: accountAdmin, res: Response) => {
  const record = await Building.find({
    deleted: false
  });

  const finalData = [];
  for (const item of record) {
    const rawData: any = {
      id: item._id,
      name: item.name,
      avatar: item.avatar,
      status: item.status,
    };

    if (item.createdBy) {
      const account = await AccountAdmin.findOne({
        _id: item.createdBy,
      });

      if (!account) {
        rawData.createdByName = "";
        return;
      };

      rawData.createdByName = account.fullName;
    }

    if (item.updatedBy) {
      const account = await AccountAdmin.findOne({
        _id: item.updatedBy,
      });

      if (!account) {
        rawData.updatedByName = "";
        return;
      };

      rawData.updatedByName = account.fullName;
    }

    if(item.createdAt) {
      rawData.createdAtFormat = moment(item.createdAt).format("HH:mm DD/MM/YYYY");
    };

    if(item.updatedAt) {
      rawData.updatedAtFormat = moment(item.updatedAt).format("HH:mm DD/MM/YYYY");
    }

    finalData.push(rawData);
  }
  res.json({
    code: "success",
    message: finalData,
  })
}