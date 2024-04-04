
import User from "../models/userModel.js";
import DataURIParser from "datauri/parser.js";
import cloudinary from "cloudinary"

 export const registerController = async (req, res) => {
  try {
    const {name, email, password, address, city, country, phone, answer, role} = req.body;

    //validation
    if(!name || !email || !city || !address || !country || !phone || !answer || !role ) {
        return res.status(500).send({
            success: false,
            message: "Please Provide All Fields"
        })
    }
    // check existing user
    const existingUser = await User.findOne({email});
    console.log(existingUser)
    if(existingUser) {
        return res.status(500).send({
            success: false,
            message: "email already exists"
        });
    } else {
    
        
        const user = await User.create({
            name,
            email,
            password,
            city,
            country,
            phone,
            address,
            answer,
            role
        });
        res.status(201).send({
            success: true,
            message:"Registeration Success, Please Login",
            user,
        })
    }

  }
  catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "Error In Register API",
        error
    })

  }
}


// LOGIN
export const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validation
        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: "Please Add Email OR Password"
            });
        }

        // Check user
        const user = await User.findOne({ email });
         console.log(user);
       
        // User validation
        if (!user) {
            return res.status(500).send({
                success: false,
                message: "User Not Found"
            });
        }

         // check pass
         const isMatch = await user.comparePassword(password);

        // Validation
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invalid credentials"
            });
        }
        // token
        const token = user.generateToken()
        res.status(200).cookie("token",token, {
            expires: new Date(Date.now() + 15 * 24 * 60 * 1000),
            secure: process.env.NODE_ENV === "development"? true: false,
            httpOnly: process.env.NODE_ENV === "development"? true: false,
            sameSite: process.env.NODE_ENV === "development"? true: false,
        }).send({
            success: true,
            message: "Login Success",
            token,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Login API"
        });
    }
};

// get user profile
 export const getUserProfileController = async (req, res) => {
       try {
        const user = User.findById( req.user._id);
                
          res.status(200).send({
            success: true,
            message: "User Profile Fetched Successfully",
            user: {
                _id: req.user._id,
                name: req.user.name,
                password: req.user.password = undefined,
                email: req.user.email,
                city: req.user.city,
                address: req.user.address,
                country: req.user.country
            }
          })
       } catch (error){
          console.log(error);
          res.status(500).send({
            success: false,
            message: "Error in Profile API"
          })
       }
 }

 // logout
export const logoutController = async (req, res) => {
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
            secure: process.env.NODE_ENV === "development"? true: false,
            httpOnly: process.env.NODE_ENV === "development"? true: false,
            sameSite: process.env.NODE_ENV === "development"? true: false,
        } ).send({
            success: true,
            message: "Logout Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in logout API"
        })
    }
}
 

// update user Profile
export const updateProfileController = async (req, res) => {
    try {
         const user = await User.findById( req.user._id);
         const { name, email, address, city, country, phone } = req.body;

         // validation
         if(name) user.name = name;
         if(email) user.name = email;
         if(address) user.address = address;
         if(city) user.city = city;
         if(country) user.country = country;
         if(phone) user.phone = phone;

         // save user
         await user.save();
         res.status(200).send({
            success: true,
            message: "User Profile Updated",
         })

    }catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in update Profile API"
        })
    }
}

// password update
export const updatePasswordController = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const {oldPassword, newPassword} = req.body;
        // validation
        if(!oldPassword || !newPassword) {
            return res.status(500).send({
                success: false,
                message: "Please provide old or new password"
            })
        }
        // old password check
        const isMatch = await user.comparePassword(oldPassword);
        // validation
        if(!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invalid Old Password"
            })
        }

        user.password = newPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "Password Updated Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in update Password API"
        })
    }
}

// update user profile photo
export const updateProfilePicController = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        // Ensure user exists
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        // Ensure file exists
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "No file uploaded"
            });
        }

        // Parse file using DataURIParser
        const parser = new DataURIParser();
        const fileData = parser.format(req.file.originalname, req.file.buffer);

              // Destroy previous profile picture on Cloudinary if it exists
              if (user.profilePic && user.profilePic.public_id) {
                await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
            }
        
        // Upload new image to cloudinary
        const result = await cloudinary.v2.uploader.upload(fileData.content);

        // Update user profile picture
        user.profilePic = {
            public_id: result.public_id,
            url: result.secure_url
        };

        await user.save();

        // Send success response
        res.status(200).send({
            success: true,
            message: "Profile picture updated successfully"
        });

    } catch (error) {
        // Log error for debugging
        console.error(error);
        // Send error response
        res.status(500).send({
            success: false,
            message: "Failed to update profile picture",
            error
        });
    }
};

// forgot password
export const forgotPasswordController = async(req, res) => {
    try {
      // user get email || newPassword || answer
      const {email, newPassword, answer } = req.body;
      // validation
      if(!email || !newPassword || !answer) {
        return res.status(500).send({
            success: false,
            message: "Please Provide All Fields"
        })
      }
      // find user
      const user = await User.findOne({email, answer});
      // validation
      if(!user) {
        return res.status(404).send({
            success: false,
            message: "User Not Found"
        })
      }
      user.password = newPassword;
      await user.save();
      res.status(200).send({
        success: true,
        message: "Your Password Has Been Reset. Please Login!"
      })
    } catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Forgot Password API"
        })
    }
}