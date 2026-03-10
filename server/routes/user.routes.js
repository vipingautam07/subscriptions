import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js'
import { getUser, getUsers, updateUser } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/me', authorize, (req, res, next) => {
    req.params.id = req.user._id;
    next();
}, getUser);

userRouter.get('/:id', authorize, getUser);

userRouter.post('/', (req, res) => {
    res.send({
        title: 'create new user'
    });
});

userRouter.put('/:id', authorize, updateUser);

userRouter.delete('/:id', (req, res) => {
    res.send({
        title: 'delete user'
    });
});

export default  userRouter;