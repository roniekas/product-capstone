const httpStatus = require('http-status');
const UserService = require('../service/UserService');
const logger = require('../config/logger');

class ProfileController {
    constructor() {
        this.userService = new UserService();
    }

    getUser = async (req, res) => {
        try {
            let status = true;
            let message = "Success getting all user";

            const userId = req.user.userId;
            let data = {}

            if(!userId){
                status = false;
                message = "Failed getting user";
                res.status(httpStatus.BAD_REQUEST).send({ status, message, data });
            }

            data = await this.userService.getUserByUuid(userId);

            if(!data){
                status = false;
                message = "Failed getting user";
                res.status(httpStatus.BAD_GATEWAY).send({ status, message, data });
            }

            data = data.dataValues;

            delete data.pin;
            delete data.createdAt;
            delete data.updatedAt;

            res.status(httpStatus.OK).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    updateUser = async (req, res) => {
        try {
            const responseData = await this.userService.changeUserData(req.body, req.user.userId);
            res.status(responseData.statusCode).send(responseData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = ProfileController;
