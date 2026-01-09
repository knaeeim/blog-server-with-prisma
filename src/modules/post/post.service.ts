import { CommentStatus, Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, authorId: string) => {
    const result = await prisma.post.create({ data: { ...data, authorId } });
    return result;
}

const getAllPosts = async ({ searchTerm, tags, isFeaturedBool, page, limit, sortBy, sortOrder }: { searchTerm: string | undefined, tags: string[] | [], isFeaturedBool: boolean | undefined, page: number, limit: number, sortBy: string, sortOrder: string }) => {

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

    if (typeof isFeaturedBool === 'boolean') {
        andConditions.push({
            isFeatured: isFeaturedBool
        })
    }

    const posts = await prisma.post.findMany(
        {
            skip: (page - 1) * limit,
            take: limit,
            where: {
                AND: andConditions
            },
            orderBy: {
                [sortBy]: sortOrder
            },
            include: {
                _count: {
                    select: {
                        comments: true
                    }
                }
            }
        }
    );

    const total = await prisma.post.count({
        where: {
            AND: andConditions
        }
    })
    return {
        data: posts,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const getPostDataById = async (id: string) => {
    return await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: { id },
            data: {
                views: {
                    increment: 1
                }
            }
        })

        return await tx.post.findUnique({
            where: { id },
            include: {
                comments: {
                    where: {
                        parentId: null,
                        status: CommentStatus.APPROVED
                    },
                    orderBy: { createdAt: "desc" },
                    include: {
                        replies: {
                            where: {
                                status: CommentStatus.APPROVED
                            },
                            orderBy: { createdAt: 'asc' },
                            include: {
                                replies: {
                                    where: {
                                        status: CommentStatus.APPROVED
                                    },
                                    orderBy: { createdAt: "asc" }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            }
        })
    })
}


const getMyPosts = async (authorId: string) => {

    await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId,
            status: "ACTIVE"
        }
    })

    return await prisma.post.findMany({
        where: {
            authorId
        }
    })
}

const updateMyOwnPost = async (postId: string, authorId: string, data: Partial<Post>, isAdmin: boolean) => {
    // first need to check authorId is exists or not or post belongs to the author or not, or If he is a admin then also he can update

    if (!isAdmin) {
        await prisma.post.findUniqueOrThrow({
            where: {
                id: postId,
                authorId
            }
        })
    }

    if(!isAdmin){
        delete data.isFeatured;
    }

    return await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            ...data
        }
    })
}

const deletePost = async (postId : string, authorId : string, isAdmin : boolean) => {
    if(!isAdmin){
        await prisma.post.findUniqueOrThrow({
            where : {
                id :postId, 
                authorId
            }
        })
    }

    return await prisma.post.delete({
        where : {
            id : postId
        }
    })
}

export const postServices = {
    createPost,
    getAllPosts,
    getPostDataById,
    getMyPosts,
    updateMyOwnPost,
    deletePost,
}