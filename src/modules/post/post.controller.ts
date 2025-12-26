import { Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    try {
        const result = await postServices.createPost(req.body);
        res.status(201).json({
            message: "Post created successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            details: error
        })
    }
}

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const result = await postServices.getAllPosts();
        res.status(200).json({
            message: "Posts retrieved successfully",
            data: result
        })
    } catch (error : any) {
        res.status(500).json({
            message: error.message,
            details: error
        })
    }
} 

export const postController = {
    createPost, 
    getAllPosts
}