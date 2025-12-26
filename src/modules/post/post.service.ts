import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    const result = await prisma.post.create({ data });
    return result;
}

const getAllPosts = async () => {
    const posts = await prisma.post.findMany();
    return posts;
}


export const postServices = {
    createPost,
    getAllPosts
}