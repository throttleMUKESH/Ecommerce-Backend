

import { stripe } from "../app.js";
import orderModel from "../models/ordeModel.js";


// create order
export const createOrderController = async(req, res) => {
    try {
        const { shippingInfo, orderItem, paymentMethod, paymentInfo, itemPrice, tax, shippingCharge, totalAmount, orderStatus } = req.body;
        //  validation
        if(!shippingInfo || !orderItem || !paymentMethod || !paymentInfo || !itemPrice || !tax || !shippingCharge || !totalAmount || !orderStatus ) {
            return res.status(404).send({
                success: false,
                message: "Provide all fields"
            })
        }
        // create order
        const order = await orderModel.create({
            user: req.user._id, 
            shippingInfo, 
            orderItem, 
            paymentMethod, 
            paymentInfo, 
            itemPrice, 
            tax, 
            shippingCharge, 
            totalAmount, 
            orderStatus
        })
        // stock update
        for (let i = 0; i < orderItem.lenth; i++){
            // find Product
            const product = await orderModel.findById(orderItem[i].product);
            await product.save();
            
        }
        res.status(201).send({
            success: true,
            message: "Order Placed Successfully",
            
        })
    } catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Create Order API",
            error
        })
    }
}


// get all orders- my orders
export const getMyorderControllers = async(req, res) => {
    try{
        // find orders
        const orders = await orderModel.find({user: req.user._id});
        // validation
        if(!orders){
            return res.status(404).send({
                success: false,
                message: "No Orders found"
            })
        }
        res.status(200).send({
            success: true,
            message: "Your orders Data",
            totalOrders: orders.lenth,
            orders
        })
    }catch(error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in My Orders Order API",
            error
        })
    }
}


// get single order infor
export const singleOrderDetailsControllers = async(req, res) => {
    try {
        // find orders
        const order = await orderModel.findById(req.params.id);
        //validation
        if(!order) {
            return res.status(404).send({
                success: false,
                message: "no orders found"
            })
        }
        res.status(200).send({
            success: true,
            message: "Your Order Fetched",
            order
        })

    } catch(error) {
        console.log(error);
        // cast error || OBJECT ID
        if(error.name === "CastError") {
            return res.status(500).send({
                success: false,
                message: "Invalid Id"
            })
        }
        res.status(500).send({
            success: false,
            message: "Error In Get Update Products API"
        })
    }
}

// payment method controller
export const paymentControllers = async(req, res) => {
    try {
        // get amount
        const {totalAmount} = req.body;
       const {client_secret} = await stripe.paymentIntents.create({
            amount: Number(totalAmount ),
            currency: "usd"
        });
        res.status(200).send({
            success: true,
            client_secret
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Payment",
            error
        })
    }
}

// ADMIN SECTIOB
// get all coders
export const getAllOrdersController = async(req, res) => {
    try{
        const orders = await orderModel.find({});
        console.log(orders)
        res.status(200).send({
    success: true,
    message: "All Orders Data",
    totalOrders: orders.length,
    orders
})
    }
catch(error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "Error In Get Update Products API",
        error
    })
}
}

// order Status
export const changeOrderStatusControllers = async(req, res) => {
    try {
    // find order 
    const order = await orderModel.findById(req.params.id);
    // validation
    if(!order){
        return res.status(404).send({
            success: false,
            message: "order not found"
        })
    }

    if(order.orderStatus == "pending") order.orderStatus = "shipped";
    else if(order.orderStatus === "shipped") {
        order.orderStatus = "delivered";
        order.deliveredAt = Date.now();
    } else {
        return res.status(500).send({
            success: false,
            message: "Order Already Delivered"
        })
    }
    await order.save();
    res.status(200).send({
        success: true,
        message: "order status updated",
      });
    }catch(error){
        res.status(500).send({
            success: false,
            message: "Error Change Order Status API",
            error
        }) 
    }
}