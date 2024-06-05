const httpStatus = require('http-status');
const BudgetService = require('../service/BudgetService');
const logger = require('../config/logger');
const { tokenTypes } = require('../config/tokens');

class BudgetController {
    constructor() {
        this.budgetService = new BudgetService();
    }

    newBudget = async (req, res) => {
        try {
            const user = await this.budgetService.createBudget(req);

            const { status, message, data } = user.response;
            res.status(user.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getAllBudget = async (req, res) => {
        try {
            const user = await this.budgetService.getAllBudget(req);

            const { status, message, data } = user.response;
            res.status(user.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    updateBudget = async (req, res) => {
        try {
            const user = await this.budgetService.updateBudget(req);

            const { status, message, data } = user.response;
            res.status(user.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    deleteBudget = async (req, res) => {
        try {
            const budgetId = req.query.budgetId ?? '';
            const user = await this.budgetService.removeById(budgetId);

            const { status, message } = user.response;
            res.status(user.statusCode).send({ status, message });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }
}

module.exports = BudgetController;
