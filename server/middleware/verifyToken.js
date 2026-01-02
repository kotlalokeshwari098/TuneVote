import ApiResponse from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // console.log(req.headers)
   try {
    const token =  req.cookies.jwt || req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "No Token Provided" });
    }
    // console.log(process.env.JWT_SECRET)
    const decoded =jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded.id);
    req.userId = decoded.id;
    // console.log(req.userId);
    next();
  } catch (err) {
    // console.error("Token verification error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export default verifyToken;