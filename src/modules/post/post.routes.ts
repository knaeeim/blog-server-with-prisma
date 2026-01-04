import { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post('/', auth(UserRole.USER), postController.createPost);

router.get('/', postController.getAllPosts);

router.get('/:id', postController.getPostDataById);

export const postRouter = router;