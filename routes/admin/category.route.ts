import { Router } from "express";
import multer from "multer";
import { storage } from "../../helpers/cloudinary.helper";
import * as categoryController from "../../controllers/admin/category.controller";
import * as middleware from "../../middlewares/accountAdmin.middleware";
import * as validate from "../../validates/category.validate";
const router = Router();

const upload = multer({
  storage: storage
})

router.post("/create", upload.single("image"), validate.categoryValidate, categoryController.categoryCreate);

router.get('/list', categoryController.categoryList);

router.post('/detail/:id', categoryController.categoryDetail);

router.patch('/edit/:id', upload.single("image"), validate.categoryValidate, categoryController.categoryEdit);

router.delete('/delete/:id', categoryController.categoryDelete);

router.get('/trash/list', categoryController.trashCategoryList);

router.patch('/trash/recovery/:id', categoryController.trashCategoryRecovery);

router.delete('/trash/delete/:id', categoryController.trashCategoryDelete);

export default router;
