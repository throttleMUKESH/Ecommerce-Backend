import { isAuth } from "../middleware/auth_middleware.js";
import {createOrderController, getMyorderControllers, singleOrderDetailsControllers, paymentControllers, getAllOrdersController, changeOrderStatusControllers} from "../controllers/orderCont.js"
import express from "express";
import { isAdmin } from "../middleware/admin_middleware.js";
 const router = express.Router();





// create orders
 router.post("/create", isAuth,  createOrderController);

 // get all orders
 router.get("/my-Orders", isAuth, getMyorderControllers);

 // get single order details
 router.get("/my-orders/:id", isAuth,  singleOrderDetailsControllers);

 // payemtn
 router.post("/payment", isAuth, paymentControllers);

 // Admin part
 router.get("/admin/get-all-orders", isAuth, isAdmin, getAllOrdersController);

 // change order status
 router.get("/admin/order/:id", isAuth, isAdmin, changeOrderStatusControllers)



 export default router;