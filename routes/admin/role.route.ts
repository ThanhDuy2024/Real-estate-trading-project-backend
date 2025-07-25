import { Router } from "express";
import * as validate from "../../validates/role.validate";
import * as roleController from "../../controllers/admin/roles.controller";
const router = Router();

router.post('/create', validate.roleValidate, roleController.roleCreate);

router.get('/list', roleController.roleList);

router.post('/detail/:id', roleController.roleDetail);

router.patch('/edit/:id', validate.roleValidate, roleController.roleEdit);

router.delete('/delete/:id', roleController.roleDelete);

router.get('/trash/list', roleController.trashRoleList);

router.patch('/trash/recovery/:id', roleController.trashRoleRecovery);

router.delete('/trash/delete/:id', roleController.trashRoleDelete);

export default router;