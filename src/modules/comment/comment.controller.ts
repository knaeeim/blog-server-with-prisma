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


export const commentController = {
    createComment
}