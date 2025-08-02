import { Router } from "express";
import * as buildingController from "../../controllers/admin/building.controller";
import { storage } from "../../helpers/cloudinary.helper";
import * as validate from "../../validates/building.validate";
import multer from "multer";
const router = Router();

const upload = multer({
  storage: storage
})

router.post("/create", upload.single("avatar"), validate.buildingValidate,  buildingController.buildingCreate);

router.get("/list", buildingController.buildingList);

router.post("/detail/:id", buildingController.buildingDetail);

router.patch("/edit/:id", upload.single("avatar"), validate.buildingValidate, buildingController.buildingEdit);

router.delete("/delete/:id", buildingController.buildingDelete);
export default router;