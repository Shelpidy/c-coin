import express from 'express';
import { CommodityUser } from '../../../models/ComUsers';

export default (router: express.Application) => {
    router.get(
        '/api/auth/',
        async (request: express.Request, response: express.Response) => {
            try {
                let users = await CommodityUser.findAll();
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
