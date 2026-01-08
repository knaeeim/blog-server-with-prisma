import { Request, Response } from "express";
import { postServices } from "./post.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

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

        const { page, limit, sortBy, sortOrder } = paginationSortingHelper(req.query);

        const result = await postServices.getAllPosts({ searchTerm, tags, isFeaturedBool, page, limit, sortBy, sortOrder });


        if (result.data.length === 0) {
            res.status(200).json({
                message: "No posts found",
                size: 0,
                data: []
            })
        } else {
            res.status(200).json({
                message: "Posts retrieved successfully",
                data: result.data,
                pagination: {
                    ...result.pagination
                }
            })
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            details: error
        })
    }
}


const getPostDataById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!id){
            throw new Error ("Post ID is required");
        }
        
        const post = await postServices.getPostDataById(id);
        res.status(200).json({
            message: "Post retrieved successfully",
            data: post
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            details: error
        })
    }
}

const getMyPosts = async (req: Request, res: Response) => {
    try {
        const user = req.user; 
        const result = await postServices.getMyPosts(user?.id as string);
        res.status(200).json({
            message: "Posts retrieved successfully",
            data: result
        });
    } catch (error : any) {
        res.status(500).json({
            message: error.message,
            details: error
        })
    }
}


export const postController = {
    createPost,
    getAllPosts,
    getPostDataById, 
    getMyPosts
}