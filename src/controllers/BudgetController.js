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
            res.status(user.statusCode).send({ status, message, data, tokens });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = BudgetController;
