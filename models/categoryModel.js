import mongoose  from "mongoose";

const categoryScchema = new mongoose.Schema({
      category:{
        type: String,
        required: [ true, "Category name is required"]
      },
     
}, {timestamps: true})

const categoryModel = mongoose.model("Category", categoryScchema);

export default categoryModel