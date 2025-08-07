import { Router } from "express";
import * as accountManagerController from "../../controllers/admin/accountManager.controller";
const router = Router();

router.post("/create", accountManagerController.accountAdminCreate);

export default router;