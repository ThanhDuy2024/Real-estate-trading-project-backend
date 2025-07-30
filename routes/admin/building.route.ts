import { Router } from "express";
import * as buildingController from "../../controllers/admin/building.controller";
import { storage } from "../../helpers/cloudinary.helper";
import multer from "multer";
const router = Router();

const upload = multer({
  storage: storage
})

router.post("/create", upload.single("avatar"), buildingController.buildingCreate);

export default router;