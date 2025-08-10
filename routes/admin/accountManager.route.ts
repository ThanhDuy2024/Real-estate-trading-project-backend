import { Router } from "express";
import * as accountManagerController from "../../controllers/admin/accountManager.controller";
import * as validate from "../../validates/auth.validate";
import { storage } from "../../helpers/cloudinary.helper";
import multer from "multer";
const router = Router();

const upload = multer({
  storage: storage
})
router.post("/create", upload.single("avatar"), validate.accountManagerValidate, accountManagerController.accountAdminCreate);

export default router;