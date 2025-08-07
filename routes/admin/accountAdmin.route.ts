import { Router } from "express";
import multer from "multer";
import { storage } from "../../helpers/cloudinary.helper";
import * as accountAdminController from "../../controllers/admin/accountAdmin.controller"; 
import * as authValidate from "../../validates/auth.validate";
import * as middleware from "../../middlewares/accountAdmin.middleware";
const router = Router();

const upload = multer({
  storage: storage
});

router.post('/register', authValidate.registerValidate, accountAdminController.registerAdmin);

router.post('/login', authValidate.loginValidate, accountAdminController.login)

router.get('/logout', accountAdminController.logout);

router.patch('/profile/edit', upload.single("avatar"), middleware.accountVerify, authValidate.profileValidate, accountAdminController.profileEdit);

router.patch('/change/password', middleware.accountVerify, accountAdminController.changePassword);
export default router;