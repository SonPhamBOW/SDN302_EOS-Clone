import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorization - No token provider",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized - Invalid token",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized - User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error authorize user:" + error,
    });
  }
};

export const adminRoute = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token) {
      return res.status(401).json({
        message: "Unauthorization - No token provider",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized - Invalid token",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (user.role != "Admin") {
      return res.status(401).json({
        message: "Cannot access this route",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error authorize user:" + error,
    });
  }
};
