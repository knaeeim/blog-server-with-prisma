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
        const { isFeatured } = req.query;
        const isFeaturedBool = isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await postServices.getAllPosts({ searchTerm, tags, isFeaturedBool, page, limit });
        if (result.length === 0) {
            res.status(200).json({
                message: "No posts found",
                data: []
            })
        } else {
            res.status(200).json({
                message: "Posts retrieved successfully",
                data: result
            })
        }
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