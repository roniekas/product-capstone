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
            let {category, startDate, endDate} = userBody;
            if (await this.budgetDao.isBudgetExists(userId, category, startDate, endDate)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Budget Already Exist!');
            }

            userBody.budgetId = uuidv4();
            userBody.userId = userId;
            userBody.spendingAmount = 0;

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

    getAllBudget = async (req) => {
        try {
            let message = 'Successfully Getting Budget!';
            const userId = req.user.userId ?? '';
            const allData = await this.budgetDao.findByWhere({userId});

            return responseHandler.returnSuccess(httpStatus.CREATED, message, allData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    }

    updateBudget = async ( req ) => {
        try {
            let message = 'Successfully Update Budget!';
            const data = req.body;
            const { budgetId } = data;
            let allData = await this.budgetDao.findOneByWhere({budgetId});

            if(allData){
                console.log({ data })
                const {category, amount, startDate, endDate, walletId} = data;
                const isSuccess = await this.budgetDao.updateWhere(
                    { category, amount, startDate, endDate, walletId },
                    { budgetId },
                );
                if(isSuccess){
                    return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
                }
            } else if (!allData) {
                message = "Budget not found!"
                return responseHandler.returnSuccess(httpStatus.BAD_REQUEST, message, allData);
            }

            message = "Failed Update Budget!"
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, message);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    }

    removeById = async (budgetId) => {
        try {
            let message = 'Successfully Delete Budget!';

            let data = await this.budgetDao.removeBudget(budgetId);
            if(data){
                return responseHandler.returnSuccess(httpStatus.OK, message, data);
            } else {
                message = 'Failed Delete Budget!';
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, message);
            }
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    }

    getBudgetById = async (budgetId) => {
        try {
            let message = 'Successfully Delete Budget!';

            let data = await this.budgetDao.findOneByWhere({budgetId});
            if(data){
                return responseHandler.returnSuccess(httpStatus.OK, message, data);
            } else {
                message = 'Failed Delete Budget!';
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, message);
            }
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    }
}

module.exports = BudgetService;
