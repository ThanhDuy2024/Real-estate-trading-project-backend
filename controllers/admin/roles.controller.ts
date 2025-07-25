import { Request, Response } from "express";
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
import { Role } from "../../models/roles.model";
import AccountAdmin from "../../models/accountAdmin.model";
import moment from "moment";
import slugify from "slugify";
import { dateFillters, pagination } from "../../helpers/managementFeature.helper";
import { Category } from "../../models/category.model";

export const roleCreate = async (req: accountAdmin, res: Response) => {
  req.body.createdBy = req.accountAdmin._id;
  req.body.updatedBy = req.accountAdmin._id;

  const newRecord = new Role(req.body);
  await newRecord.save();
  res.json({
    code: "success",
    message: "Role created successfully"
  });
}

export const roleList = async (req: Request, res: Response) => {
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
  let paginationFeature: any = {}
  if (req.query.page) {
    const sumDocuments = await Category.countDocuments(find);
    paginationFeature = pagination(sumDocuments, String(req.query.page));
  }
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

export const roleDetail = async (req: Request, res: Response) => {
  try {
    const record = await Role.findOne({
      _id: req.params.id,
      deleted: false
    });

    if(!record) {
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
  try {
    const check = await Role.findOne({
      _id: req.params.id,
      deleted: false
    });

    if(!check) {
      res.json({
        code: "error",
        message: "item not found"
      });
    };

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
  try {
    const check = await Role.findOne({
      _id: req.params.id,
      deleted: false,
    });

    if(!check) {
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
  const record = await Role.find({
    deleted: true
  });

  const finalData = [];
  for (const item of record) {
    const rawData:any = {
      id: item.id,
      name: item.name,
    }
    
    if(item.deletedBy) {
      const check = await AccountAdmin.findOne({
        _id: item.deletedBy
      });

      if(!check) {
        rawData.deleteByName = "";
        return;
      };

      rawData.deleteByName = check.fullName;
    };

    if(item.deletedAt) {
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
  try {
    const id = req.params.id;

    const record = await Role.findOne({
      _id: id,
      deleted: true,
    });

    if(!record) {
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
  try {
    const id = req.params.id;

    const record = await Role.findOne({
      _id: id,
      deleted: true
    });

    if(!record) {
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