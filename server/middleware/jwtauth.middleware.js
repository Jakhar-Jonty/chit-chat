const jwt = require('jsonwebtoken');
const {User} = require('../models/user.models')

// Middleware to verify JWT token
exports.verifyToken = async (req, res, next) => {

    // if (req.path === '/login' || req.path === '/register') {
    //     return next();
    // }
    // console.log(req.headers);
    // console.log("req=>",req.headers);
    
    const token = req.headers['authorization'].split(" ")[1]
    console.log("token", token);
    if (!token) return res.status(401).json({ message: 'Token not provided' });
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            console.log("invalid token: ");
            return res.status(403).json({ message: 'Invalid token' });
        }
        if (user) {
            // console.log(user);
            
            const isUser = await User.findOne({ _id: user.userId }).select("-password")
            // console.log(isUser);

            if (isUser===null) return res.status(403).json({ message: 'User not found' });
            req.user = isUser
        }

        console.log("Token verified");
        next();
    });
};