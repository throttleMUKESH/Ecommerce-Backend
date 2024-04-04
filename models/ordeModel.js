import mongoose from "mongoose";
 const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, "address is required"]
        },
        city: {
            type: String,
            required: [true, "city name is required"]
        },
        country: {
            type: String,
            required: [true, "country name is required"]
        },
    },
    orderItem: [
        {
            name: {
                type: String,
                required: [true, "product name is required"]
            },
            price: {
                type: Number,
                required: [true, "product price is required"]
            },
            quantity: {
                type: Number,
                required: [true, "product quantity is required"]
            },
            // imaage: {
            //     type: String,
            //     required: [true, "product imaage is required"]
            // },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            }
        }
    ],
    paymentMethod: {
        type: String,
        enum: ["Cash On Delivery", "Online"],
        default: "Cash On Delivery"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user id is required"]
    },
    paidAt: Date,
    paymentInfo: {
        id: String,
        status: String
    },
    itemPrice: {
        type: Number,
        required: [true, "item price is required"]
    },
    tax: {
        type: Number,
        required: [true, "item tax price is required"]
    },
    shippingCharge: {
        type: Number,
        required: [true, "item shippingCharge is required"]
    },
    totalAmount: {
        type: Number,
        required: [true, "item totalAmount is required"]
    },
    orderStatus: {
        type: String,
        enum: ["pending", "shipped", "delivered"],
        default: "pending"
    },
    deliveredAt: Date

}, {timestamps: true})

 const orderModel = mongoose.model("Order", orderSchema);

 export default orderModel;