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

router.get("/list", accountManagerController.accountAdminList);

router.get("/detail/:id", accountManagerController.accountAdminDetail);

router.patch("/edit/:id", upload.single("avatar"), validate.accountManagerEditValidate, accountManagerController.accountAdminEdit);

router.delete("/delete/:id", accountManagerController.accountAdminDelete);

router.get("/trash/list", accountManagerController.accountAdminTrashList);

router.patch("/trash/recovery/:id", accountManagerController.accountAdminTrashRecovery);

router.delete("/trash/delete/:id", accountManagerController.accountAdminTrashDelete);
export default router;