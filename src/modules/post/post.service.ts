import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, authorId: string) => {
    const result = await prisma.post.create({ data: { ...data, authorId } });
    return result;
}

const getAllPosts = async ({ searchTerm, tags, isFeaturedBool }: { searchTerm: string | undefined, tags: string[] | [], isFeaturedBool: boolean | undefined }) => {

    const andConditions: PostWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: searchTerm as string,
                        mode: 'insensitive'
                    }
                },
                {
                    content: {
                        contains: searchTerm as string,
                        mode: 'insensitive'
                    }
                },
                {
                    tags: {
                        has: searchTerm as string
                    }
                }

            ]
        })
    }

    if (tags.length > 0) {
        andConditions.push({
            tags: {
                hasEvery: tags
            }
        })
    }

    if(typeof isFeaturedBool === 'boolean'){
        andConditions.push({
            isFeatured : isFeaturedBool
        })
    }

    const posts = await prisma.post.findMany(
        {
            where: {
                AND: andConditions
            }
        }
    );
    return posts;
}


export const postServices = {
    createPost,
    getAllPosts
}