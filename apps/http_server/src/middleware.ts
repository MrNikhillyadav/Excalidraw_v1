import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export function authMiddleware(req: Request, res :  Response, next : NextFunction){
  const token = req.headers?.authorization?.split(" ")[1];
  try{
    const decoded = jwt.verify(token, "JWT_SECRET_KEY");
    if(!decoded){
      res.json({
        message : "Invalid token"
      })
      return;
    }
    req.userId = decoded.id;
    next();
    
  }
  catch(e){
    res.json({
      message : "not authorized"
    })
  }
}
