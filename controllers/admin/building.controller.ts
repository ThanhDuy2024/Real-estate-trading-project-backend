import { raw, Response } from "express";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
import { Category } from "../../models/category.model";
import Building from "../../models/building.model";
import AccountAdmin from "../../models/accountAdmin.model";
import { buildingPermissions } from "../../enums/permission.enum";
import moment from "moment";
import slugify from "slugify";
import { dateFillters, pagination } from "../../helpers/managementFeature.helper";

export const buildingCreate = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(buildingPermissions.buildingCreate)) {
    res.json({
      code: "error",
      message: "You are not permission in feature!"
    });
    return;
  }

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
  if (!req.accountAdmin.permissions.includes(buildingPermissions.buildingList)) {
    res.json({
      code: "error",
      message: "You are not permission in feature!"
    });
    return;
  }
  try {
    const find: any = {
      deleted: false
    }

    //search 
    if (req.query.search) {
      const keyword = slugify(String(req.query.search), {
        lower: true
      });
      const regex = new RegExp(keyword);

      find.slug = regex;
    }
    //end search

    //status
    if (req.query.status) {
      find.status = req.query.status;
    }
    //end status

    //date
    if (req.query.startDate || req.query.endDate) {
      find.createdAt = dateFillters(String(req.query.startDate), String(req.query.endDate));
    }
    //end date

    //pagination 
    const sumDocuments = await Building.countDocuments(find);
    let page = "1";
    if (req.query.page) {
      page = String(req.query.page);
    }
    const paginations = pagination(sumDocuments, page);
    //end pagination
    const record = await Building.find(find).skip(paginations.skip).limit(paginations.limit)
      .sort({
        createdAt: "desc"
      });

    const finalData = [];

    for (const item of record) {
      const rawData: any = {
        id: item.id,
        name: item.name,
        avatar: item.avatar,
      }

      if (item.updatedBy) {
        const check = await AccountAdmin.findOne({
          _id: item.updatedBy
        });

        if (!check) {
          rawData.updatedByName = "";
        } else {
          rawData.updatedByName = check.fullName;
        }
      }

      if (item.createdBy) {
        const check = await AccountAdmin.findOne({
          _id: item.createdBy
        });

        if (!check) {
          rawData.createdByName = "";
        } else {
          rawData.createdByName = check.fullName;
        }
      }

      if (item.updatedAt) {
        rawData.updatedAtFormat = moment(item.updatedAt).format("HH:mm DD/MM/YYYY");
      }

      if (item.createdAt) {
        rawData.createdAtFormat = moment(item.createdAt).format("HH:mm DD/MM/YYYY");
      }
      finalData.push(rawData);
    }
    res.json({
      code: "success",
      data: finalData,
      pages: paginations.pages
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error"
    })
  }
}

export const buildingDetail = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(buildingPermissions.buildingDetail)) {
    res.json({
      code: "error",
      message: "You are not permission in feature!"
    });
    return;
  }
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
  if (!req.accountAdmin.permissions.includes(buildingPermissions.buildingEdit)) {
    res.json({
      code: "error",
      message: "You are not permission in feature!"
    });
    return;
  }
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
  if (!req.accountAdmin.permissions.includes(buildingPermissions.buildingDelete)) {
    res.json({
      code: "error",
      message: "You are not permission in feature!"
    });
    return;
  }
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

export const trashBuildingList = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(buildingPermissions.trashBuildingList)) {
    res.json({
      code: "error",
      message: "You are not permission in feature!"
    });
    return;
  }
  const find: any = {
    deleted: true
  }

  //search
  if (req.query.search) {
    const keyword = slugify(String(req.query.search), {
      lower: true
    });

    const regex = new RegExp(keyword);

    find.slug = regex;
  }
  //end search

  //pagination 
  const sumDocuments = await Building.countDocuments(find);
  let page = "1";
  if (req.query.page) {
    page = String(req.query.page);
  }
  const paginations = pagination(sumDocuments, page);
  //end pagination
  const building = await Building.find(find).sort({
    deletedAt: "desc"
  }).skip(paginations.skip).limit(paginations.skip);


  const finalData = [];
  for (const item of building) {
    const rawData: any = {
      id: item.id,
      name: item.name,
      avatar: item.avatar,
    }

    if (item.deletedBy) {
      const account = await AccountAdmin.findOne({
        _id: item.deletedBy,
        deleted: false
      });

      if (!account) {
        rawData.deletedByName = "";
        return;
      } else {
        rawData.deletedByName = account.fullName;
      }
    }

    if (item.deletedAt) {
      rawData.deletedAtFormat = moment(item.deletedAt).format("HH:mm DD/MM/YYYY");
    }

    finalData.push(rawData);
  }
  res.json({
    code: "success",
    data: finalData,
    pages: paginations.pages
  })
}

export const trashBuildingRecovery = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(buildingPermissions.trashBuildingRecovery)) {
    res.json({
      code: "error",
      message: "You are not permission in feature!"
    });
    return;
  }
  try {
    const id = req.params.id;

    const building = await Building.findOne({
      _id: id,
      deleted: true
    });

    if (!building) {
      res.json({
        code: "error",
        message: "The building is not found"
      });
      return;
    }

    await Building.updateOne({
      _id: id
    }, {
      deleted: false,
      updateBy: req.accountAdmin._id,
      updatedAt: Date.now(),
    });

    res.json({
      code: "success",
      message: "The building is recovery"
    });
  } catch (error) {
    res.json({
      code: "error",
      message: error
    })
  }
}

export const trashBuildingDelete = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(buildingPermissions.trashBuildingDelete)) {
    res.json({
      code: "error",
      message: "You are not permission in feature!"
    });
    return;
  }
  try {
    const id = req.params.id;

    const building = await Building.findOne({
      _id: id,
      deleted: true,
    });

    if (!building) {
      res.json({
        code: "error",
        message: "The building is not found"
      });
      return;
    }

    await Building.deleteOne({
      _id: id,
    });
    res.json({
      code: "success",
      message: "The building has been deleted"
    });
  } catch (error) {
    res.json({
      code: "error",
      message: error
    })
  }
}