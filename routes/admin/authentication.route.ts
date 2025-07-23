import { Router } from "express";
import * as authenticationController from "../../controllers/admin/authentication.controller";
const router = Router();

router.get('/check', authenticationController.profile);

export default router;