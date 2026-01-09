import { NextFunction, Request, Response } from "express";

function errorHandler(err : any, req : Request, res : Response, next : NextFunction) {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500)
    console.log(err);
    res.json({
        message : err.message,
        message2 : "Global Error Handler",
        details: err
    })
}

export default errorHandler;