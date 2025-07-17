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

router.post("/create", upload.single("image"), middleware.accountVerify, validate.categoryValidate, categoryController.categoryCreate);

router.get('/list', middleware.accountVerify, categoryController.categoryList);

router.post('/edit/:id', upload.single("image"), middleware.accountVerify, validate.categoryValidate, categoryController.categoryEdit);

router.delete('/delete/:id', middleware.accountVerify, categoryController.categoryDelete);

router.get('/trash/list', middleware.accountVerify, categoryController.trashCategoryList);

export default router;
