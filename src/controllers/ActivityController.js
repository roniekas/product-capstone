const httpStatus = require('http-status');
const ActivityService = require('../service/ActivityService');
const BudgetService = require('../service/BudgetService');
const logger = require('../config/logger');

class ActivityController {
    constructor() {
        this.activityService = new ActivityService();
        this.budgetService = new BudgetService();
    }

    register = async (req, res) => {
        try {
            const userId = req.user.userId ?? '';
            const { avtivityType, category, notes, date, walletId, iconId, billId } = req.body;
            if(!userId){
                res.status(404).send({"success": false, "message": "user not found!"})
            }

            const isWalletExist = this.budgetService.getBudgetById()

            const user = await this.activityService.createUser(req.body);
            let tokens = {};
            const { status } = user.response;
            if (user.response.status) {
                tokens = await this.activityService.generateAuthTokens(user.response.data);
            }

            const { message, data } = user.response;
            res.status(user.statusCode).send({ status, message, data, tokens });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = ActivityController;
