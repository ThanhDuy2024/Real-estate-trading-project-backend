import e, { raw, Response } from "express";
import bcrypt from "bcryptjs"
import { accountAdmin } from "../../interfaces/accountAdmin.interface";
import AccountAdmin from "../../models/accountAdmin.model";
import * as managementFeature from "../../helpers/managementFeature.helper";
import moment from "moment";
import slugify from "slugify";
import { Role } from "../../models/roles.model";

export const accountAdminCreate = async (req: accountAdmin, res: Response) => {
  if (req.file) {
    req.body.avatar = req.file.path;
  } else {
    delete req.body.avatar;
  };

  const checkAccountExisted = await AccountAdmin.findOne({
    email: req.body.email,
  });

  if (checkAccountExisted) {
    res.json({
      code: "error",
      message: "Email your account has been existed!"
    });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(String(req.body.password), salt);

  req.body.password = hash;
  req.body.createdBy = req.accountAdmin._id;

  const newAccount = new AccountAdmin(req.body);
  newAccount.save();
  res.json({
    code: "success",
    message: "account has been created",
  })
}

export const accountAdminList = async (req: accountAdmin, res: Response) => {
  const find: any = {
    _id: { $ne: req.accountAdmin._id },
    deleted: false
  };

  //Search account name
  if(req.query.search) {
    const keyword = slugify(String(req.query.search), {
      lower: true,
    });
    const regex = new RegExp(keyword);
    find.slug = regex;
  }
  //end search account name

  //role filter
  if(req.query.roleId) {
    const role = await Role.findOne({
      _id: req.query.roleId,
    });
    if(role) {
      find.roleId = role.id
    }
  }
  //end role filter

  //pagination
  const sumDocuments = await AccountAdmin.countDocuments(find);
  let page = "1";
  if(req.query.page) {
    page = String(req.query.page);
  };
  const pagination = managementFeature.pagination(sumDocuments, page);
  //end pagination

  const record = await AccountAdmin.find(find).sort({
    createdAt: "desc"
  }).skip(pagination.skip).limit(pagination.limit);

  const finalData: any = [];
  for (const item of record) {
    const rawData: any = {
      id: item._id,
      fullName: item.fullName,
      avatar: item.avatar ? item.avatar : "",
      roleId: item.roleId ? item.roleId : "",
      createdByName: "",
      updatedByName: "",
      createdAtFormat: "",
      updatedAtFormat: "",
    }

    if (item.createdBy) {
      const account = await AccountAdmin.findOne({
        _id: item.createdBy
      });

      if (account) {
        rawData.createdByName = account.fullName;
      }
    }

    if (item.updateBy) {
      const account = await AccountAdmin.findOne({
        _id: item.updateBy
      });

      if (account) {
        rawData.updatedByName = account.fullName;
      }
    }

    if (item.createdAt) {
      rawData.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    }

    if (item.updatedAt) {
      rawData.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
    }
    finalData.push(rawData);
  }
  res.json({
    code: "success",
    data: finalData,
    totalPage: pagination.pages,
  })
}

export const accountAdminDetail = async (req: accountAdmin, res: Response) => {
  try {
    const id = req.params.id;
    const record = await AccountAdmin.findOne({
      _id: id,
      deleted: false
    });

    if(!record) {
      res.json({
        code: "error",
        message: "account is not found"
      });
      return;
    }

    const finalData:any = {
      id: record._id,
      fullName: record.fullName,
      avatar: record.avatar ? record.avatar : "",
      roleId: record.roleId ? record.roleId : "",
      email: record.email,
      address: record.address ? record.address : "",
      phone: record.phone ? record.phone : "",
      updatedByName: "",
      createdByName: "",
      roleName: "",
    }

    if(record.createdAt) {
      finalData.createdAtFormat = moment(record.createdAt).format("HH:mm DD/MM/YYYY");
    }

    if(record.updatedAt) {
      finalData.updatedAtFormat = moment(record.updatedAt).format("HH:mm DD/MM/YYYY");
    }

    if(record.updateBy) {
      const account = await AccountAdmin.findOne({
        _id: record.updateBy,
        deleted: false
      });
      
      if(account) {
        finalData.updatedByName = account.fullName;
      }
    }

    if(record.createdBy) {
      const account = await AccountAdmin.findOne({
        _id: record.createdBy,
        deleted: false
      });
      
      if(account) {
        finalData.createdByName = account.fullName;
      }
    }
    
    if(record.roleId) {
      const role = await Role.findOne({
        _id: record.roleId,
        deleted: false
      });

      if(role) {
        finalData.roleName = role.name
      }
    }

    res.json({
      code: "success",
      data: finalData
    })
  } catch (error) {
    res.json({
      code: "error",
      message: error
    })
  }
}

export const accountAdminEdit = async (req: accountAdmin, res: Response) => {
  try {
    const id = req.params.id;
    
    const account = await AccountAdmin.findOne({
      _id: id,
      deleted: false
    });

    if(!account) {
      res.json({
        code: "error",
        message: "Account is not found!"
      });
      return;
    }

    const emailCheck = await AccountAdmin.findOne({
      _id: { $ne: account._id},
      email: req.body.email
    });

    if(emailCheck) {
      res.json({
        code: "error",
        message: "account email has been existed!"
      });
      return;
    }

    if(req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    const role = await Role.findOne({
      _id: req.body.roleId,
      deleted: false
    });

    if(!role) {
      res.json({
        code: "error",
        message: "account roleId has not been existed!"
      });
      return;
    }

    req.body.updateBy = req.accountAdmin._id

    await AccountAdmin.updateOne({
      _id: account._id,
      deleted: false
    }, req.body);

    
    res.json({
      code: "success",
      message: "account has been edited"
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "account has not been edited!"
    })
  }
}

export const accountAdminDelete = async (req: accountAdmin, res: Response) => {
  try {
    const id = req.params.id;
    const account = await AccountAdmin.findOne({
      _id: id,
      deleted: false
    });

    if(!account) {
      res.json({
        code: "error",
        message: "The account admin is not found!"
      });
      return;
    }

    await AccountAdmin.updateOne({
      _id: account._id
    }, {
      deleted: true,
      deletedAt: Date.now(),
      deletedBy: req.accountAdmin._id
    });

    res.json({
      code: "success",
      message: "The account admin has been deleted!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "The account admin has not been deleted!"
    })
  }
}

export const accountAdminTrashList = async (req: accountAdmin, res: Response) => {
  const find:any = {
    deleted: true,
  }

  //search
  if(req.query.search) {
    const keyword = slugify(String(req.query.search), {
      lower: true,
    });
    const regex = new RegExp(keyword);
    find.slug = regex;
  }
  //end search

  let page = "1";
  const sumDocuments = await AccountAdmin.countDocuments(find);
  if(req.query.page) {
    page = String(req.query.page);
  }
  const pagination = managementFeature.pagination(sumDocuments, page);

  const account = await AccountAdmin.find(find).skip(pagination.skip).limit(pagination.limit)
    .sort({
      deletedAt: "desc"
    });
  
  const finalData:any = [];

  for (const item of account) {
    const rawData:any = {
      id: item._id,
      fullName: item.fullName,
      avatar: item.avatar,
      roleId: item.roleId ? item.roleId : "",
      roleName: "",
      deletedAtFormat: "",
      deletedByName: "",
    }

    if(item.deletedAt) {
      rawData.deletedAtFormat = moment(item.deletedAt).format("HH:mm DD/MM/YYYY");
    }

    if(item.deletedBy) {
      const account = await AccountAdmin.findOne({
        _id: item.deletedBy,
        deleted: false
      })

      if(account) {
        rawData.deletedByName = account.fullName; 
      }
    }

    if(item.roleId) {
      const role = await Role.findOne({
        _id: item.roleId,
        deleted: false,
      });

      if(role) {
        rawData.roleName = role.name
      }
    }

    finalData.push(rawData);
  }
  res.json({
    code: "success",
    data: finalData,
    totalPage: pagination.pages
  })
}