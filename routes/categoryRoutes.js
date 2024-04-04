
import express from "express";
import { isAuth } from "../middleware/auth_middleware.js";

import { isAdmin } from "../middleware/admin_middleware.js";

import {createCategory, getAllCategoryController, deleteCategoryController, updateCategoryController} from "../controllers/categoryCont.js"

const router = express.Router();

// Create Category
router.post("/create", isAuth, isAdmin, createCategory);

// get-All-Category 
router.get("/get-All-Category", isAuth, getAllCategoryController);

// detelte category
router.delete("/delete/:id", isAuth, isAdmin, deleteCategoryController);

// update all category
router.put("/update/:id", isAuth, isAdmin, updateCategoryController);

export default router;