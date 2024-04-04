import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productMode.js";





// create category cont
 export const createCategory = async(req, res) => {
    try {
        const {category} = req.body;
        // validation
        if(!category){
            return res.status(404).send({
                success: false,
                message: "please provide Category name"
            })
        }
        await categoryModel.create({category});
        res.status(201).send({
            success: true,
            message: `${category} category created successfully`
        })
    } catch(error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error to Create Category API"
        })
    }
}

// get all category cont
export const getAllCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        return res.status(200).send({
            success: true,
            message: "All category found",
            totalCategories: category.length,
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error to get All Category API"
        })
    }
}

// delete category cont
export const deleteCategoryController = async (req, res) => {
     try {
       const category = await categoryModel.findById(req.params.id);
       
       if(!category) {
        return res.status(404).send({
            success: false,
            message: "Not Found"
        })
       }
       // find product with this category id
       const products = await productModel.find({category: category._id});
       // delete product category
       for (let i = 0; i < products.length; i++){
         const product = products[i];
         product.category = undefined;
         await product.save()
       }
       await category.deleteOne();
       res.status(200).send({
        success: true,
        message: "Category Deleted Successfully"
       }
       )

     } catch (error) {
        console.log(error);
        // cast error || OBJECT ID
        if (error.name === "CastError") {
            res.status(500).send({
                success: false,
                message: "Invalid ID"
            })
        }

        res.status(500).send({
            success: false,
            message: "Error to Delete Category API"
        })
        }
      
     
}


export const updateCategoryController = async (req, res) => {
    try {
        const categoryId = req.params.id.trim(); // Remove leading/trailing whitespace
        // Find category
        let categorys = await categoryModel.findById(categoryId);
         console.log(categorys)
        // Validation
        if (!categorys) {
            return res.status(404).send({
                success: false,
                message: "invalid ID"
            })
        }
        // extract the category from the req body
        const shouldUpdateCategory = req.body.category;
       
        console.log(shouldUpdateCategory)

        categorys.category = shouldUpdateCategory;
        await categorys.save();

           // Return a success response with the updated category
           res.status(200).json({ 
            success: true,
         message: "Category updated successfully", 
       
         });
       
    } catch (error) {
        console.log(error);
        if (error.name === "CastError") {
            return res.status(400).send({
                success: false,
                message: "Invalid ID"
            });
        }
        res.status(500).send({
            success: false,
            message: "Error in Update Category API",
            error
        });
    }
};


