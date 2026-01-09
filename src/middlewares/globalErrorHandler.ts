import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(err : any, req : Request, res : Response, next : NextFunction) {
    let statusCode = 500;
    let errorMessage = "Internal Server Error"; 
    let errorDetails = err;

    if(err instanceof Prisma.PrismaClientValidationError){
        statusCode = 400;
        errorMessage = "You provided field(s) are not valid or missing field(s)";
    }

    res.status(statusCode)
    res.json({
        message : errorMessage,
        details: errorDetails
    })
}

export default errorHandler;