import { Request, Response } from "express"
import { Category } from "../../models/category.model";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
import AccountAdmin from "../../models/accountAdmin.model";
import moment from "moment";
import slugify from "slugify";
export const categoryCreate = async (req: accountAdmin, res: Response) => {
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

export const categoryList = async (req: Request, res: Response) => {
  const find:any = {
    deleted: false
  }

  //search cateogry
  if(req.query.search) {
    const keyword = slugify(String(req.query.search), {
      lower: true
    });
    find.slug = keyword;
  }
  //end search category

  //status fillters
  if(req.query.status === "active" || req.query.status === "inactive") {
    find.status = req.query.status;
  }
  //end status fillters

  const dataFinal = [];
  const record = await Category.find(find).sort({
    position: "desc"
  });

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
  })
}

export const categoryEdit = async (req: accountAdmin, res: Response) => {
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
      deleted: false
    })
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
  const record = await Category.find({
    deleted: true
  })

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
    categories: dataFinal
  });
}

export const trashCategoryRecovery = async (req: accountAdmin, res: Response) => {
  try {
    const check = await Category.findOne({
      deleted: true,
      _id: req.params.id
    });

    if(!check) {
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
  try {
    const check = await Category.findOne({
      deleted: true,
      _id: req.params.id
    });

    if(!check) {
      res.json({
        code: "error"
      });
      return;
    };

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