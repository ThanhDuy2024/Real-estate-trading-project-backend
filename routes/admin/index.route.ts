import { Router } from "express";
import accountAdminRoute from "./accountAdmin.route";
import categoryRoute from "./category.route";
const router = Router();

router.use('/account', accountAdminRoute);

router.use('/category', categoryRoute);
export default router;