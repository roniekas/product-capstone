const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const WalletDao = require('../dao/WalletDao');
const ActivityDao = require('../dao/ActivityDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class ActivityService {
    constructor() {
        this.walletDao = new WalletDao();
        this.activityDao= new ActivityDao();
    }

    /**
     * Create a user
     * @param {Object} userBody
     * @param {string} userId
     * @returns {Object}
     */
    createActivity = async (userBody, userId) => {
        try {
            let message = 'Successfully Create new Activity!';

            userBody.userId = userId;
            userBody.activityId = uuidv4();
            userBody.activityType = userBody.activityType === 'income';

            let activityData = await this.activityDao.create(userBody);

            if (!activityData) {
                message = 'Registration Failed! Please Try again.';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }

            activityData = activityData.toJSON();

            delete activityData.createdAt;
            delete activityData.updatedAt;

            activityData.activityType = activityData.activityType ? 'income' : 'outcome';

            return responseHandler.returnSuccess(httpStatus.CREATED, message, activityData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };

    createMany = async (datas) => {
        try {
            const data = "OK";
            const message = "OK";
            await this.activityDao.bulkCreate(datas);

            return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };
}

module.exports = ActivityService;
