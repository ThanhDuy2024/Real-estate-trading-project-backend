import { Request, Response } from "express";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
import { Role } from "../../models/roles.model";
import AccountAdmin from "../../models/accountAdmin.model";
import moment from "moment";
import slugify from "slugify";
import { dateFillters, pagination } from "../../helpers/managementFeature.helper";
import { Category } from "../../models/category.model";
import { rolePermissions, categoryPermissions } from "../../enums/permission.enum";

export const roleCreate = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(rolePermissions.roleCreate)) {
    res.json({
      code: "error",
      message: "you not permission in feature!"
    });
    return;
  };

  //check permisson role co ton tai hay khong
  const permissionsArray: any = []
  permissionsArray.push(...Object.values(rolePermissions));
  permissionsArray.push(...Object.values(categoryPermissions));

  let check = "ok"
  req.body.permissions.forEach((item: any) => {
    if (!permissionsArray.includes(item)) {
      check = "not ok";
      return;
    };
  });

  if (check === "not ok") {
    res.json({
      code: "error"
    });
    return;
  }
  //end check permission role exited

  req.body.createdBy = req.accountAdmin._id;
  req.body.updatedBy = req.accountAdmin._id;

  const newRecord = new Role(req.body);
  await newRecord.save();
  res.json({
    code: "success",
    message: "Role created successfully"
  });
}

export const roleList = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(rolePermissions.roleEdit)) {
    res.json({
      code: "error",
      message: "you not permission in feature!"
    });
    return;
  };

  const find: any = {
    deleted: false
  };

  //search
  if (req.query.search) {
    const keyword = slugify(String(req.query.search), {
      lower: true,
    });
    const regex = new RegExp(keyword);
    find.slug = regex;
  }
  //end search

  //status filters
  if (req.query.status === "active" || req.query.status === "inactive") {
    find.status = req.query.status;
  }
  //end status filters

  //date filters
  if (req.query.startDate && req.query.endDate) {
    find.createdAt = dateFillters(String(req.query.startDate), String(req.query.endDate));
  }
  //end date filters

  //Pagination
  const sumDocuments = await Role.countDocuments(find);
  let page = "1"
  if (req.query.page) {
    page = String(req.query.page);
  }
  const paginationFeature = pagination(sumDocuments, page);
  //end pagination

  const record = await Role.find(find).limit(paginationFeature.limit).skip(paginationFeature.skip)
    .sort({
      createdAt: "desc"
    });

  const finalData = [];

  for (const item of record) {
    const rawData: any = {
      id: item._id,
      name: item.name,
      status: item.status,
    };

    if (item.createdBy) {
      const check = await AccountAdmin.findOne({
        _id: item.createdBy
      })

      if (!check) {
        rawData.createdByName = "";
        return;
      }

      rawData.createdByName = check.fullName;
    }

    if (item.updatedBy) {
      const check = await AccountAdmin.findOne({
        _id: item.updatedBy
      })

      if (!check) {
        rawData.updatedByName = "";
        return;
      }

      rawData.updatedByName = check.fullName;
    }

    if (item.updatedAt) {
      rawData.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
    }

    if (item.createdAt) {
      rawData.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    }

    finalData.push(rawData);
  }

  res.json({
    code: "success",
    data: finalData
  })
}

export const roleDetail = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(rolePermissions.roleDetail)) {
    res.json({
      code: "error",
      message: "you not permission in feature!"
    });
    return;
  };

  try {
    const record = await Role.findOne({
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

    const finalData = {
      id: record._id,
      name: record.name,
      permissions: record.permissions,
    }
    res.json({
      code: "success",
      message: finalData
    });
  } catch (error) {
    res.json({
      code: "error",
      message: error
    });
  }
}

export const roleEdit = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(rolePermissions.roleEdit)) {
    res.json({
      code: "error",
      message: "you not permission in feature!"
    });
    return;
  };

  try {
    const check = await Role.findOne({
      _id: req.params.id,
      deleted: false
    });

    if (!check) {
      res.json({
        code: "error",
        message: "item not found"
      });
    };

    //check permissions role co ton tai trong he trong hay khong
    const permissionsArray: any = []
    permissionsArray.push(...Object.values(rolePermissions));
    permissionsArray.push(...Object.values(categoryPermissions));

    let checkOut = "ok"
    req.body.permissions.forEach((item: any) => {
      if (!permissionsArray.includes(item)) {
        checkOut = "not ok";
        return;
      };
    });

    if (checkOut === "not ok") {
      res.json({
        code: "error"
      });
      return;
    };
    //end check permissions role co ton tai trong he trong hay khong

    req.body.updatedBy = req.accountAdmin._id,

      await Role.updateOne({
        _id: req.params.id,
        deleted: false
      }, req.body);

    res.json({
      code: "success",
      message: "Role Edit successfully"
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: error
    })
  }
}

export const roleDelete = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(rolePermissions.roleDelete)) {
    res.json({
      code: "error",
      message: "you not permission in feature!"
    });
    return;
  };

  try {
    const check = await Role.findOne({
      _id: req.params.id,
      deleted: false,
    });

    if (!check) {
      res.json({
        code: "error",
        message: "item not found"
      });
      return;
    }

    await Role.updateOne({
      _id: check._id,
      deleted: false
    }, {
      deleted: true,
      deletedAt: Date.now(),
      deletedBy: req.accountAdmin._id
    });

    res.json({
      code: "success",
      message: "Role has been deleted"
    })
  } catch (error) {
    res.json({
      code: "success",
      message: error
    })
  }
}

export const trashRoleList = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(rolePermissions.trashRoleList)) {
    res.json({
      code: "error",
      message: "you not permission in feature!"
    });
    return;
  };

  const record = await Role.find({
    deleted: true
  });

  const finalData = [];
  for (const item of record) {
    const rawData: any = {
      id: item.id,
      name: item.name,
    }

    if (item.deletedBy) {
      const check = await AccountAdmin.findOne({
        _id: item.deletedBy
      });

      if (!check) {
        rawData.deleteByName = "";
        return;
      };

      rawData.deleteByName = check.fullName;
    };

    if (item.deletedAt) {
      rawData.deletedAtFormat = moment(item.deletedAt).format("HH:mm DD/MM/YYYY");
    }

    finalData.push(rawData);

  }
  res.json({
    code: "success",
    data: finalData
  });
}

export const trashRoleRecovery = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(rolePermissions.trashRoleRecovery)) {
    res.json({
      code: "error",
      message: "you not permission in feature!"
    });
    return;
  };

  try {
    const id = req.params.id;

    const record = await Role.findOne({
      _id: id,
      deleted: true,
    });

    if (!record) {
      res.json({
        code: "error",
        message: "item not found",
      });
    }

    await Role.updateOne({
      _id: record?._id
    }, {
      deleted: false,
      updatedBy: req.accountAdmin._id
    });

    res.json({
      code: "success",
      message: "Recovery role successfully"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: error
    })
  }
}

export const trashRoleDelete = async (req: accountAdmin, res: Response) => {
  if (!req.accountAdmin.permissions.includes(rolePermissions.roleDelete)) {
    res.json({
      code: "error",
      message: "you not permission in feature!"
    });
    return;
  };

  try {
    const id = req.params.id;

    const record = await Role.findOne({
      _id: id,
      deleted: true
    });

    if (!record) {
      res.json({
        code: "error",
        message: "item not found"
      });
    }

    await Role.deleteOne({
      _id: record?._id
    });

    res.json({
      code: "success",
      message: "Deleted successfully"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: error
    })
  }
}