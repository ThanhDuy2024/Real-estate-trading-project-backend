import { Router } from "express";
import * as accountAdminController from "../../controllers/admin/accountAdmin.controller"; 
import * as authValidate from "../../validates/auth.validate";
const router = Router();

router.post('/register', authValidate.registerValidate, accountAdminController.registerAdmin);

router.post('/login', authValidate.loginValidate, accountAdminController.login)
export default router;