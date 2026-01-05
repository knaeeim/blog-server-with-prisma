import { prisma } from "../../lib/prisma"

const createComment = async (payload: { content: string, authorID: string, postId: string, parentId: string }) => {

    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })

    if (payload.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId
            }
        })
    }

    const result = await prisma.comment.create({
        data: payload
    })
    return result;
}

const getCommentById = async (id: string) => {
    return await prisma.comment.findUnique({
        where: {
            id
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            },
            replies: true
        }
    })
}

const getCommentByAuthorId = async (authorID: string) => {
    return await prisma.comment.findMany({
        where: {
            authorID
        },
        orderBy: { createdAt: 'desc' },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            },
            replies: true,
        }

    })
}


export const commentServices = {
    createComment,
    getCommentById,
    getCommentByAuthorId
}