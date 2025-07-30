import { Request, Response } from "express"
import { Category } from "../../models/category.model";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
import AccountAdmin from "../../models/accountAdmin.model";
import * as managementFeature from "../../helpers/managementFeature.helper"
import { categoryPermissions } from "../../enums/permission.enum"
import moment from "moment";
import slugify from "slugify";
import Building from "../../models/building.model";

export const categoryCreate = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(categoryPermissions.categoryCreate)) {
    res.json({
      code: "error",
      message: "you are not permission in feature!"
    });
    return;
  }

  const record = await Category.find({
    deleted: false,
  })

  if (req.file) {
    req.body.image = req.file.path;
  } else {
    delete req.body.image;
  }

  if (!req.body.position) {
    const count = await Category.countDocuments({}) + 1;
    req.body.position = count;
  }
  req.body.updatedBy = req.accountAdmin._id;
  req.body.createdBy = req.accountAdmin._id;

  let check;
  if (req.body.parentId) {
    const array = JSON.parse(req.body.parentId);
    array.forEach((item: any) => {
      check = record.find(category => category.id === item);
      if (!check) {
        check = "not ok";
        return;
      };
    });
    if (check === "not ok") {
      res.json({
        code: "error",
      });
      return;
    }
    req.body.parentId = array;
  }
  const newRecord = new Category(req.body);
  await newRecord.save();
  res.json({
    code: "success",
    message: "Tạo danh mục thành công"
  });
};

export const categoryList = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(categoryPermissions.categoryList)) {
    res.json({
      code: "error",
      message: "you are not permission in feature!"
    });
    return;
  };

  const find: any = {
    deleted: false
  }

  //search cateogry
  if (req.query.search) {
    const keyword = slugify(String(req.query.search), {
      lower: true
    });
    const regex = new RegExp(keyword);
    find.slug = regex;
  }
  //end search category

  //status fillters
  if (req.query.status === "active" || req.query.status === "inactive") {
    find.status = req.query.status;
  }
  //end status fillters

  //date fillters
  if (req.query.startDate || req.query.endDate) {
    find.createdAt = managementFeature.dateFillters(String(req.query.startDate), String(req.query.endDate));
  }
  //end date fillters

  //Pagination
  let paginationFeature: any = {}
  if (req.query.page) {
    const sumDocuments = await Category.countDocuments(find);
    paginationFeature = managementFeature.pagination(sumDocuments, String(req.query.page));
  }
  //end pagination

  const dataFinal = [];
  const record = await Category.find(find).sort({
    position: "desc"
  }).limit(paginationFeature.limit).skip(paginationFeature.skip);

  for (const item of record) {
    const rawData = {
      id: item.id,
      name: item.name,
      parentId: item.parentId,
      note: item.note,
      status: item.status,
      image: item.image ? item.image : "",
      position: item.position,
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
    pages: paginationFeature.pages,
  })
}

export const categoryDetail = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(categoryPermissions.categoryDetail)) {
    res.json({
      code: "error",
      message: "you are not permission in feature!"
    });
    return;
  }

  try {
    const record = await Category.findOne({
      _id: req.params.id,
      deleted: false
    });

    if (!record) {
      res.json({
        code: "error",
        message: "item not found"
      });
      return;
    };

    const finalData: any = {
      id: record._id,
      name: record.name,
      parentId: record.parentId,
      note: record.note,
      image: record.image,
      position: record.position,
      status: record.status,
    };

    if (record.createdBy) {
      const check = await AccountAdmin.findOne({
        _id: record.createdBy,
      })

      if (!check) {
        finalData.createdByName = "";
        return;
      }
      finalData.createdByName = check.fullName;
    }

    if (record.updatedBy) {
      const check = await AccountAdmin.findOne({
        _id: record.updatedBy,
      })

      if (!check) {
        finalData.updatedByName = "";
        return;
      }
      finalData.updatedByName = check.fullName;
    }

    if (record.createdAt) {
      finalData.createdAtFormat = moment(record.createdAt).format("HH:mm DD/MM/YYYY");
    }

    if (record.updatedAt) {
      finalData.updatedAtFormat = moment(record.updatedAt).format("HH:mm DD/MM/YYYY");
    }

    res.json({
      code: "success",
      data: finalData
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "errror",
      message: error
    })
  }
}

export const categoryEdit = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(categoryPermissions.categoryEdit)) {
    res.json({
      code: "error",
      message: "you are not permission in feature!"
    });
    return;
  };

  try {
    const checkId = await Category.findOne({
      _id: req.params.id,
      deleted: false
    });

    if (!checkId) {
      res.json({
        code: "error"
      });
      return;
    }

    const record = await Category.find({
      _id: { $ne: checkId._id },
      deleted: false
    })

    console.log(record);

    if (req.file) {
      req.body.image = req.file.path;
    } else {
      delete req.body.image;
    }

    if (req.body.parentId) {
      const array = JSON.parse(req.body.parentId);

      let check;
      array.forEach((item: any) => {
        check = record.find(category => category.id == item);
        if (!check) {
          check = "not ok"
          return;
        }
      });

      if (check === "not ok") {
        res.json({
          code: "error",
        });
        return;
      }
      req.body.parentId = array;
    }

    req.body.updatedBy = req.accountAdmin._id;

    await Category.updateOne({
      _id: req.params.id,
      deleted: false
    }, req.body);

    res.json({
      code: "success",
      message: "Edit successfully"
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Edit failure"
    })
  }
}

export const categoryDelete = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(categoryPermissions.categoryDelete)) {
    res.json({
      code: "error",
      message: "you are not permission in feature!"
    });
    return;
  };

  try {
    const record = await Category.findOne({
      deleted: false,
      _id: req.params.id,
    });

    if (!record) {
      res.json({
        code: "error",
      });
      return;
    };

    await Category.updateOne({
      _id: req.params.id,
    }, {
      deleted: true,
      deletedBy: req.accountAdmin._id,
      deletedAt: Date.now(),
    })

    res.json({
      code: "success",
      message: "Delete successfully"
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: error,
    })
  }
}

export const trashCategoryList = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(categoryPermissions.trashCategoryList)) {
    res.json({
      code: "error",
      message: "you are not permission in feature!"
    });
    return;
  };

  const find: any = {
    deleted: true
  }

  //search cateogry
  if (req.query.search) {
    const keyword = slugify(String(req.query.search), {
      lower: true
    });
    find.slug = keyword;
  }
  //end search category

  //status fillters
  if (req.query.status === "active" || req.query.status === "inactive") {
    find.status = req.query.status;
  }
  //end status fillters

  //date fillters
  if (req.query.startDate || req.query.endDate) {
    find.createdAt = managementFeature.dateFillters(String(req.query.startDate), String(req.query.endDate));
  }
  //end date fillters

  //Pagination
  const sumDocuments = await Category.countDocuments(find);
  const paginationFeature = managementFeature.pagination(sumDocuments, String(req.query.page));
  //end pagination

  const record = await Category.find(find).limit(paginationFeature.limit).skip(paginationFeature.skip);

  if (!record) {
    res.json({
      code: "error",
      message: "Categories not found!"
    });
    return;
  }

  const dataFinal = [];

  for (const item of record) {
    const rawData = {
      id: item._id,
      name: item.name,
      image: item.image ? item.image : "",
      deletedBy: "",
      deletedAt: ""
    }

    if (item.deletedBy) {
      const check = await AccountAdmin.findOne({
        _id: item.deletedBy,
      });

      if (check) {
        rawData.deletedBy = String(check.fullName);
      }
    }

    if (item.deletedAt) {
      const dateFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YYYY");
      rawData.deletedAt = String(dateFormat);
    }

    dataFinal.push(rawData);
  }
  res.json({
    code: "success",
    categories: dataFinal,
    pages: paginationFeature.pages
  });
}

export const trashCategoryRecovery = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(categoryPermissions.trashCategoryRecovery)) {
    res.json({
      code: "error",
      message: "you are not permission in feature!"
    });
    return;
  };

  try {
    const check = await Category.findOne({
      deleted: true,
      _id: req.params.id
    });

    if (!check) {
      res.json({
        code: "error"
      });
      return;
    }

    await Category.updateOne({
      _id: req.params.id,
    }, {
      deleted: false,
      updatedBy: req.accountAdmin._id
    });
    res.json({
      code: "success",
      message: "Recovery has been successful"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Recovery has not been successful"
    })
  }
}

export const trashCategoryDelete = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(categoryPermissions.trashCategoryDelete)) {
    res.json({
      code: "error",
      message: "you are not permission in feature!"
    });
    return;
  }
  try {
    const check = await Category.findOne({
      deleted: true,
      _id: req.params.id
    });

    if (!check) {
      res.json({
        code: "error"
      });
      return;
    };

    //building category update
    const building = await Building.find({
      categoryId: check._id,
    });

    const dataId = [];
    
    if (building) {
      for (const item of building) {
        dataId.push(item._id);
      }

      await Building.updateMany({
        _id: { $in: dataId }
      }, {
        categoryId: ""
      })
    }
    //end building category update

    await Category.deleteOne({
      _id: check.id
    });
    res.json({
      code: "success",
      message: "Category has been deleted forever"
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Category has not been deleted forever"
    })
  }
}