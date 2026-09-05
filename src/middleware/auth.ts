import { NextFunction, Request, Response } from "express";
import { validateToken } from "../utils/token";
import AppResponse from "../utils/AppResponse";
import { AuthUser } from "../types/express";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return AppResponse.sendErrors({
      res,
      data: null,
      message: "No token provided",
      code: 401,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = validateToken(token) as AuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    return AppResponse.sendErrors({
      res,
      data: null,
      message: "Invalid or expired token",
      code: 401,
    });
  }
};

export default authenticate;
