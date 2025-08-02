import { Response } from "express";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
import { Category } from "../../models/category.model";
import Building from "../../models/building.model";
import AccountAdmin from "../../models/accountAdmin.model";
import moment from "moment";
import { date } from "joi";

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
  try {
    const record = await Building.find({
      deleted: false
    });
    res.json({
      code: "success",
      data: record
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error"
    })
  }
}

export const buildingDetail = async (req: accountAdmin, res: Response) => {
  try {
    const id = req.params.id;
    const record = await Building.findOne({
      _id: id,
      deleted: false,
    });

    if (!record) {
      res.json({
        code: "error",
        message: "Item not found!"
      });
      return;
    }

    const finalData: any = {
      id: record?._id,
      name: record.name,
      avatar: record.avatar ? record.avatar : "",
      address: record.address,
      arceage: record.acreage,
      numberOfFloors: record.numberOfFloors ? record.numberOfFloors : "",
      rentPrice: record.rentPrice ? record.rentPrice : "",
      purchasePrice: record.purchasePrice ? record.purchasePrice : "",
      status: record.status,
      categoryId: record.categoryId,
      manager: record.manager ? record.manager : "",
    }

    res.json({
      code: "success",
      message: finalData
    })
  } catch (error) {
    res.json({
      code: "error",
      message: error
    })
  }
}

export const buildingEdit = async (req: accountAdmin, res: Response) => {
  try {
    const id = req.params.id;
    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    const building = await Building.findOne({
      _id: id,
      deleted: false
    });

    if (!building) {
      res.json({
        code: "error",
        message: "The building is not found!"
      });
      return;
    }

    if (!req.body.rentPrice && !req.body.purchasePrice) {
      res.json({
        code: "error",
        message: "The rent price or the purchase price is empty!"
      });
      return;
    }

    if (req.body.rentPrice) {
      req.body.rentPrice = parseInt(req.body.rentPrice);
    }

    if (req.body.purchase) {
      req.body.purchasePrice = parseInt(req.body.purchasePrice)
    }

    if (req.body.numberOfFloors) {
      req.body.numberOfFloors = parseInt(req.body.numberOfFloors);
    }

    req.body.updatedBy = req.accountAdmin._id;

    await Building.updateOne({
      _id: id
    }, req.body);

    res.json({
      code: "success",
      message: "The building has been edited!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: error
    })
  }
}

export const buildingDelete = async (req: accountAdmin, res: Response) => {
  try {
    const id = req.params.id;

    const building = await Building.findOne({
      _id: id,
      deleted: false
    });

    if (!building) {
      res.json({
        code: "error",
        message: "The building not found!"
      });
      return;
    }

    await Building.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.accountAdmin._id,
      deletedAt: Date.now()
    });

    res.json({
      code: "success",
      message: "The building has been deleted!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: error
    })
  }
}