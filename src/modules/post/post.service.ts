import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, authorId: string) => {
    const result = await prisma.post.create({ data: { ...data, authorId } });
    return result;
}

const getAllPosts = async (payLoad: { searchTerm: string | undefined }) => {
    const posts = await prisma.post.findMany(
        {
            where: {
                OR: [
                    {
                        title: {
                            contains: payLoad.searchTerm as string,
                            mode: 'insensitive'
                        }
                    }, 
                    {
                        content : {
                            contains : payLoad.searchTerm as string, 
                            mode : 'insensitive'
                        }
                    }

                ]
            }
        }
    );
    return posts;
}


export const postServices = {
    createPost,
    getAllPosts
}