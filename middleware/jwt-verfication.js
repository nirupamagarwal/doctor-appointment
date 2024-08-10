import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const verifyUser = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        errorHandler(401, "You are not authorized, kindly login first")
      );
    }
    const token = authHeader.split(" ")[2];
    if (!token) {
      return next(errorHandler(401, "Token not provided"));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error("JWT Verification Error:", err);
        return next(errorHandler(401, err));
      }
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};
