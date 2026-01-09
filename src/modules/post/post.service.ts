import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

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

    if (!isAdmin) {
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

const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
    if (!isAdmin) {
        await prisma.post.findUniqueOrThrow({
            where: {
                id: postId,
                authorId
            }
        })
    }

    return await prisma.post.delete({
        where: {
            id: postId
        }
    })
}

const getStats = async () => {
    return await prisma.$transaction(async (tx) => {
        const [totalPosts, publishedPosts, draftPosts, archivedPosts, totalComments, approvedComments, rejectedComments, totalUsers, totalAdmin, userCount, totalViews] = await Promise.all([
            await tx.post.count(),
            await tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
            await tx.post.count({ where: { status: PostStatus.DRAFT } }),
            await tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
            await tx.comment.count(),
            await tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
            await tx.comment.count({ where: { status: CommentStatus.REJECTED } }),
            await tx.user.count(),
            await tx.user.count({ where: { role: UserRole.ADMIN } }),
            await tx.user.count({ where: { role: UserRole.USER } }),
            await tx.post.aggregate({ _sum: { views: true } })
        ])

        return {
            totalPosts,
            publishedPosts,
            draftPosts,
            archivedPosts,
            totalComments,
            approvedComments,
            rejectedComments,
            totalUsers,
            totalAdmin,
            totalRegularUsers: userCount,
            totalViews : totalViews._sum.views
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
    getStats,
}