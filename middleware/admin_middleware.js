

// Admin auth
export const isAdmin = async(req, res, next) => {
    if(req.user.role !== "admin"){
        return res.status(401).send({
            success: false,
            message: "Admin only"
        })
    }
    next();
}