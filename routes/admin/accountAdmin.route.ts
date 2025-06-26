import { Router } from "express";
import * as accountAdminController from "../../controllers/admin/accountAdmin.controller"; 
const router = Router();

router.post('/register', accountAdminController.registerAdmin);

export default router;