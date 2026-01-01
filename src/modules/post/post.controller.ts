import { Request, Response } from "express";
import { postServices } from "./post.service";
import { string } from "better-auth/*";

const createPost = async (req: Request, res: Response) => {
    try {
        const result = await postServices.createPost(req.body, req.user?.id as string);
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
        const { search } = req.query;
        const searchTerm = typeof search === 'string' ? search : undefined;
        const tags = req.query.tags ? (req.query.tags as string).split(',') : [];
        const result = await postServices.getAllPosts({ searchTerm, tags });
        res.status(200).json({
            message: "Posts retrieved successfully",
            data: result
        })
    } catch (error: any) {
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