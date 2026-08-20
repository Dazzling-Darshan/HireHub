import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "User is unauthorized. Please log in.",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded?.userId || decoded?.id || decoded?._id;

        if (!userId) {
            return res.status(401).json({
                message: "Invalid session token. Please log in again.",
                success: false
            });
        }

        req.id = userId;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Session expired or invalid. Please log in again.",
            success: false
        });
    }
};

export default isAuthenticated;