import express from "express";
import { loginController, registerController, getUserProfileController, logoutController, updateProfileController, updatePasswordController, updateProfilePicController, forgotPasswordController } from "../controllers/userCont.js";
import { isAuth } from "../middleware/auth_middleware.js";
import { singleUpload } from "../middleware/multer.js";
import rateLimit from "express-rate-limit";
const router = express.Router();


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})


// register
router.post("/register", limiter, registerController);

//login
router.post("/login", limiter, loginController);

// profile
router.get("/profile", isAuth, getUserProfileController);

// logout
router.get("/logout",isAuth, logoutController);

// update profile
router.put("/profile-update", isAuth, updateProfileController);

// update password
router.put("/password-update", isAuth, updatePasswordController);

// update profile pic
router.put("/update-profilePic", isAuth, singleUpload, updateProfilePicController);

// forgot password
router.post("/rest-password", isAuth, forgotPasswordController)

export default router