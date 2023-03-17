import express from 'express';
import { User } from '../../../models/User';

export default (router: express.Application) => {
    router.get(
        '/api/auth/',
        async (request: express.Request, response: express.Response) => {
            try {
                let users = await User.findAll();
                console.log(users);
                response.status(200).json({
                    status: 'success',
                    data: users,
                });
            } catch (err) {
                console.log(err);
                response.status(404).json({
                    status: 'error',
                    message: err,
                });
            }
        }
    );
};
