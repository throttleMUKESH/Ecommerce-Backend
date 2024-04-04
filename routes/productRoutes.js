import express from "express";

import { 
    getAllProductController, 
    getSingleProductController, 
    createProductController, 
    updateProductController, 
    updateProuductImageController, 
    deleteProductImageController,
    deleteProductController, 
    productReviewController,
    getTopProductsController
} from "../controllers/productCont.js";

import { isAuth } from "../middleware/auth_middleware.js";
import { isAdmin } from "../middleware/admin_middleware.js";
import { singleUpload } from "../middleware/multer.js";

const router = express();

// routes
router.get("/get-all", getAllProductController);

// get top products
router.get("/topProducts", getTopProductsController);

// get single products
router.get("/:id", getSingleProductController);

// create product
router.post("/create", isAuth, isAdmin, singleUpload, createProductController);

// update product
router.put("/:id", isAuth, isAdmin, updateProductController);

// update product image
router.put("/image/:id", isAuth, isAdmin, singleUpload, updateProuductImageController);

// delete product image
router.delete("/delete-image/:id", isAuth, isAdmin, singleUpload, deleteProductImageController);

// delete product and all its images
router.delete("/delete-product/:id", isAuth, isAdmin, singleUpload, deleteProductController);

// review product
router.put("/review/:id", isAuth, productReviewController)

export default router