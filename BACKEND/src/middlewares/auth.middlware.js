import jwt from "jsonwebtoken";

async function verifyUser(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please Login."
            });
        }
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        req.user = decoded; //that new property added by us
        console.log(decoded);
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid Token."
        });
    }
}

export default verifyUser;