import { Router } from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router(); 

router.get('/:id', commentController.getCommentById);

router.get('/author/:authorID', commentController.getCommentByAuthorId);

router.post('/', auth(UserRole.ADMIN, UserRole.USER), commentController.createComment);

router.delete('/:id', auth(UserRole.ADMIN, UserRole.USER), commentController.deleteComment);

router.patch('/:id', auth(UserRole.ADMIN, UserRole.USER), commentController.updateComment);

export const commentRoutes = router;