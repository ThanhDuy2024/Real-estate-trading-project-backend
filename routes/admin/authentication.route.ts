import { Router } from "express";
import * as authenticationController from "../../controllers/admin/authentication.controller";
import * as middleware from "../../middlewares/accountAdmin.middleware";
const router = Router();

router.get('/check', middleware.accountVerify, authenticationController.profile);

export default router;