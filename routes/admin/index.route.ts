import { Router } from "express";
import accountAdminRoute from "./accountAdmin.route";
const router = Router();

router.use('/account', accountAdminRoute);

export default router;