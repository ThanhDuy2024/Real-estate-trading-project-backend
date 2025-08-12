import { raw, Response } from "express";
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