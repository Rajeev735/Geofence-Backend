import router from "express";
import { getMyStatus } from "../controllers/status.controller";
import { protect } from "../Middlewares/auth.middleware";


const statusRoutes=router()

statusRoutes.get("/",protect, getMyStatus)

export default statusRoutes;