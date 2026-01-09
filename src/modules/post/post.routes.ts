import { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.get('/stats', auth(UserRole.ADMIN), postController.getStats);

router.post('/', auth(UserRole.USER, UserRole.ADMIN), postController.createPost);

router.get('/', postController.getAllPosts);

router.get('/my-posts', auth(UserRole.USER, UserRole.ADMIN), postController.getMyPosts);

router.get('/:id', postController.getPostDataById);

router.patch('/my-post/:postId', auth(UserRole.USER, UserRole.ADMIN), postController.updateMyOwnPost);

router.delete('/delete/:postId', auth(UserRole.USER, UserRole.ADMIN), postController.deletePost);

export const postRouter = router;