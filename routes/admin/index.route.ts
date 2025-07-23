import { Router } from "express";
import accountAdminRoute from "./accountAdmin.route";
import categoryRoute from "./category.route";
import authenticationRoute from "./authentication.route";
import roleRoute from "./role.route";
import * as middleware from "../../middlewares/accountAdmin.middleware";
const router = Router();

router.use('/account', accountAdminRoute);

router.use('/category', middleware.accountVerify, categoryRoute);

router.use('/authentication', middleware.accountVerify, authenticationRoute);

router.use('/role', middleware.accountVerify, roleRoute);
export default router;