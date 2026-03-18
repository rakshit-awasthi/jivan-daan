import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import donorsRouter from "./donors";
import requestsRouter from "./requests";
import hospitalsRouter from "./hospitals";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(donorsRouter);
router.use(requestsRouter);
router.use(hospitalsRouter);
router.use(statsRouter);

export default router;
