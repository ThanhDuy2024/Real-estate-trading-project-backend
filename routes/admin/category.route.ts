import { Router } from "express";
import multer from "multer";
import { storage } from "../../helpers/cloudinary.helper";
import * as categoryController from "../../controllers/admin/category.controller";
const router = Router();

const upload = multer({
  storage: storage
})

router.post("/create", upload.single("image"), categoryController.categoryCreate);

export default router;