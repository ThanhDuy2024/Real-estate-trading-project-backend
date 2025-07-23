import { Router } from "express";
import * as validate from "../../validates/role.validate";
import * as roleController from "../../controllers/admin/roles.controller";
const router = Router();

router.post('/create', validate.roleValidate, roleController.roleCreate);

router.get('/list', roleController.roleList);

export default router;