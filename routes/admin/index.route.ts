import { Router } from "express";
import accountAdminRoute from "./accountAdmin.route";
import categoryRoute from "./category.route";
import authenticationRoute from "./authentication.route";
const router = Router();

router.use('/account', accountAdminRoute);

router.use('/category', categoryRoute);

router.use('/authentication', authenticationRoute);
export default router;