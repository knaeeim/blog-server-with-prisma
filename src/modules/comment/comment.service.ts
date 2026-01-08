import { CommentStatus } from "../../../generated/prisma/enums"
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

const deleteComment = async (id: string, userId : string) => {
    const result = await prisma.comment.deleteMany({
        where : {
            id, 
            authorID: userId
        }
    })

    if(result.count === 0){
        throw new Error ("Comment not found or you are not authorized to delete this comment");
    }

    return result;
}


const updateComment = async (commentId : string, authorId : string , data : { content ?: string, status?: CommentStatus} ) => {
    const result = await prisma.comment.findFirst({
        where : {
            id : commentId,
            authorID : authorId
        },
        select : {
            id : true
        }
    })

    if(!result){
        throw new Error ("Comment not found or you are not authorized to update this comment");
    }

    const updatedComment = await prisma.comment.update({
        where : {
            id : commentId
        },
        data : {
            ...data
        }
    })

    return updatedComment;
}

const moderateComment = async (commentId : string, data : { status : CommentStatus }) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where : {
            id: commentId
        }, 
        select : {
            id : true,
            status : true
        }
    })

    if(commentData.status === data.status){
        throw new Error ("Comment is already in the desired status");
    }

    return await prisma.comment.update({
        where : {
            id : commentId
        }, 
        data : {
            ...data
        }
    })
}

export const commentServices = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment,
    moderateComment
}