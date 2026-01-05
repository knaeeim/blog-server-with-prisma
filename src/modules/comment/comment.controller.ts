import { Request, Response } from "express";
import { commentServices } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        req.body.authorID = user?.id;
        const result = await commentServices.createComment(req.body);
        res.status(201).json({
            message: "Comment created successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            details: error
        })
    }
}

const getCommentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        const result = await commentServices.getCommentById(id as string);
        res.status(200).json({
            message: "Comment retrieved successfully",
            data: result
        })
    } catch (error : any) {
        res.status(500).json({
            message: error.message,
            details: error
        })
    }
}


const getCommentByAuthorId = async ( req: Request, res: Response) => {
    try {
        const { authorID } = req.params; 
        const result = await commentServices.getCommentByAuthorId(authorID as string);
        res.status(200).json({
            message: "Comments retrieved successfully",
            data: result
        })
    } catch (error : any) {
        res.status(500).json({
            message: error.message,
            details: error
        })
    }
}


export const commentController = {
    createComment, 
    getCommentByAuthorId, 
    getCommentById
}