import router from "express"

import { protect } from "../Middlewares/auth.middleware"
import { getMyProfile, updateMyProfile } from "../controllers/profile.controller"

const profileRoutes=router()

profileRoutes.get("/",protect,getMyProfile)
profileRoutes.put("/update",protect,updateMyProfile)

export default profileRoutes