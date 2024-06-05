const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const BudgetDao = require('../dao/BudgetDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const { Op } = require('sequelize');
const moment = require('moment/moment');

class BudgetService {
    constructor() {
        this.budgetDao = new BudgetDao();
    }

    /**
     * Create a user
     * @returns {Object}
     * @param req
     */
    createBudget = async (req) => {
        try {
            const userBody = req.body;
            const userId = req.user.userId ?? '';
            let message = 'Successfully Create Budget!';
            console.log({ userBody });
            let {category, startDate, endDate} = userBody;
            if (await this.budgetDao.isBudgetExists(userId, category, startDate, endDate)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Budget Already Exist!');
            }

            userBody.budgetId = uuidv4();
            userBody.userId = userId;
            // userBody.startDate = {
            //     [Op.eq]: moment(startDate).utc().format('YYYY-MM-DD')
            // }
            // userBody.endDate = {
            //     [Op.eq]: moment(endDate).utc().format('YYYY-MM-DD')
            // }
            userBody.spendingAmount = 0;

            console.log({ userBody });

            let budgetData = await this.budgetDao.create(userBody);

            if (!budgetData) {
                message = 'Creating Budget Failed! Please Try again.';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }

            budgetData = budgetData.toJSON();
            delete budgetData.createdAt;
            delete budgetData.updatedAt;

            return responseHandler.returnSuccess(httpStatus.CREATED, message, budgetData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };
}

module.exports = BudgetService;
