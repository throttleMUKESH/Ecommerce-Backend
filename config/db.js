import mongoose from "mongoose";

const connectDB = async () => {
    try{
       await mongoose.connect("mongodb://localhost:27017/ECOM");
       console.log(`MongoDB connected ${mongoose.connection.host}`);
    }
    catch(error) {
        console.log(`mongoDB error ${error}`)
    }
};

export default connectDB;