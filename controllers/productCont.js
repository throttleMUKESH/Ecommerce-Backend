
import productModel from "../models/productMode.js";
import cloudinary from "cloudinary";
import {getDataUri} from "../utils/features.js"
// get all product
export const getAllProductController = async (req, res) => {
    const { keyword, category, page, limit } = req.query;
    try{
        const startIndex = (page - 1) * limit;

        const totalProducts = await productModel.countDocuments({});
   
        const totalPages = Math.ceil(totalProducts / limit );
        console.log(typeof(Number(page)));

       const products = await productModel.find({
        name: {
            $regex: keyword ? keyword : "",
            $options: "i" // Use $options for case-insensitive matching
        },
        category: category ? category : undefined
       })
       .populate("category")
       .skip(startIndex)
       .limit(limit)

       res.status(200).send({
        success: true,
        message: "all products fetcehd successfully",
        paginatino: {
            totalPages: totalPages,
            currentPage: Number(page),
            totalProducts: totalProducts,
            hasNextPage: startIndex + limit < totalProducts,
            hasPreviousPage: Number(page) > 1,
            nextPage: 1 + Number(page),
            previousPage: Number(page) -1
        },
        products
       })
    } catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Get All Product API",
            error
        })
    }
}

// get top products
export const getTopProductsController = async(req, res) => {
    try {
        const products = await productModel.find({}).sort({ rating: -1}).limit(2);
        res.status(200).send({
            success: true,
            message: "Top 3 products",
            products
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Get TOP Products"
        })
    }

}

// get single products
export const getSingleProductController = async (req, res) => {
    try{
        // get product if
        const product = await productModel.findById( req.params.id);
        // validation
        if(!product){
            return res.status(404).send({
                success: false,
                message: "Product not found"
            });
           }
           res.status(200).send({
            success: true,
            message:"Product found successfully",
            product
        })
    }catch(error){
        console.log(error);
        // cast error || OBJECT ID
        if ( error.name === "CastError"){
            return res.status(500).send({
                success: false,
                message: "Invalid Id"
            })
        }
        res.status(500).send({
            success: false,
            message: "Error In Get single Product API",
            error
    })
}
}

// create product
export const createProductController = async(req, res) => {
    try {
        const {name, description, price, category, stock, quantity} = req.body;
        // validation
    //     if(!name || !description || !price || !stock){
    //     return res.status(500).send({
    //         success: false,
    //         message: "Please Provide all fields"
    //     })
    // }
    if(!req.file){
        return res.status(500).send({
            success: false,
            message: "Please provide product images"
        })
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
        public_id: cdb.public_id,
        url: cdb.secure_url
    }
    await productModel.create({
         name,
         description,
         price, 
         category,
         stock,
         quantity,
         images: [image]
    })

    res.status(201).send({
        success: true,
        message: "Product Created Successfully"
    })
    }catch(error){
        console.log(error);
            res.status(500).send({
            success: false,
            message: "Error In Get single Product API",
            error
    })
    }
}

export const updateProductController = async (req, res) => {
    try {
        // Find product
        const product = await productModel.findById(req.params.id);

        // Check if product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Destructure request body
        const { name, description, price, stock, category } = req.body;

        // Validate and update product fields
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (stock) product.stock = stock;
        if (category) product.category = category;

        // Save updated product
        await product.save();

        return res.status(200).send({
            success: true,
            message: "Product details updated"
        });
    } catch (error) {
        console.error(error);

        // Handle specific errors
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            });
        }

        // General error handling
        return res.status(500).send({
            success: false,
            message: "Failed to update product details"
        });
    }
};

// update product image
export const updateProuductImageController = async (req, res) => {
    try {
       // find product
       const product = await productModel.findById(req.params.id);
       // validation
       if(!product){
        return res.status(404).send({
            success: false,
            message: "Product not found"
        })
       }
       // check file
       if(!req.file){
        return res.status(404).send({
            success: false,
            message: "Product image not found"
        })
       }

       const file = getDataUri(req.file);
       const cdb = await cloudinary.v2.uploader.upload(file.content);
       const image = {
        public_id: cdb.public_id,
        url: cdb.secure_url
       }
     // Save the image reference to the product
    product.images.push(image);
    await product.save();

    return res.status(200).send({
        success: true,
        message: "Product image uploaded successfully"
    });
    } catch(error){
        console.error(error);

        // Handle specific errors
        if (error.name === "CastError") {
            return res.status(400).send({
                success: false,
                message: "Invalid ID"
            });
        }

        // General error handling
        return res.status(500).send({
            success: false,
            message: "Failed to update product Image"
        });
    }
}

// delete product image
export const deleteProductImageController = async(req, res) => {
    try {
        // find product
        const product = await productModel.findById(req.params.id);
        // validation
        if(!product){
            return res.status(404).send({
                success: false,
                message: "Product Not Found"
            })
        }
        // find image id
        const id = req.query.id;
        if(!id){
            return res.status(404).send({
                success: false,
                message: "Product image not found"
            })
        }
        // looping images array
        let isExist = -1;
        product.images.forEach((item, idx) => {
            if(item._id.toString() === id.toString()) isExist = idx
        })
        if(isExist < 0){
            return res.status(404).send({
                success: false,
                message: "Image Not Found"
            })
        }
        // Delete Product Image
        await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
        product.images.splice(isExist, 1);
        await product.save();
        return res.status(200).send({
            success: true,
            message: "Product Image Deleted Successfully"
        })
    } catch(error) {
        console.error(error);

        // Handle specific errors
        if (error.name === "CastError") {
            return res.status(400).send({
                success: false,
                message: "Invalid ID"
            });
        }

        // General error handling
        return res.status(500).send({
            success: false,
            message: "Error to delete product Image API"
        });
    }
}


// Delete Product
export const deleteProductController = async(req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        // validation
        if(!product){
            return res.status(404).send({
                success: false,
                message: "Product Not Found"
            })
        }
        // find Product and Delete all Images from Cloudinary
        for(let index = 0; index < product.images.length; index++ ){
            await cloudinary.v2.uploader.destroy(product.images[index].public_id)
        }
        await productModel.deleteOne({ _id: req.params.id });
        res.status(200).send({
            success: true,
            message: "Product Deleted Successfully"
        })
    }catch(error){
        console.error(error);

        // Handle specific errors
        if (error.name === "CastError") {
            return res.status(400).send({
                success: false,
                message: "Invalid ID"
            });
        }

        // General error handling
        return res.status(500).send({
            success: false,
            message: "Error to delete product  API"
        });
    }
}


// create product review
export const productReviewController = async(req, res) => {
    try {
       const {comment, rating} = req.body;
       // find product
       const product = await productModel.findById((req.params.id).trim());
       // check previous review
       const alreadyReviewed = product.reviews.find( (r) => r.user.toString() === req.user._id.toString());
       if(alreadyReviewed) {
        return res.status(400).send({
            success: false,
            message: "product already reviewed"
        })
    }
    // creating review obj
    const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
    }
    // pushing review obj in product.review
    product.reviews.push(review);
    // saving no. of reviews
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    // save
    await product.save();
    res.status(200).send({
        success: true,
        message: "Review Added"
    })
    } catch(error) {
        console.log(error);
        // cast error || OBJECT ID
        if(error.name === "CastError"){
            return res.status(500).send({
                success: false,
                message: "Invalid ID"
            })
        };
        res.status(500).send({
            success: false,
            message: "Error In Review Comment API"
        })
    }
}