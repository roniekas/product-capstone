const httpStatus = require('http-status');
const ActivityService = require('../service/ActivityService');
const BudgetService = require('../service/BudgetService');
const WalletService = require('../service/WalletService');
const logger = require('../config/logger');
const responseHandler = require('../helper/responseHandler');

class ActivityController {
    constructor() {
        this.activityService = new ActivityService();
        this.budgetService = new BudgetService();
        this.walletService = new WalletService();
    }

    addNewActivity = async (req, res) => {
        try {
            const userId = req.user.userId ?? '';
            const { amount, walletId, activityType } = req.body;
            const isIncome = activityType === 'income';
            if(!userId){
                res.status(404).send({"success": false, "message": "user not found!"})
            }

            const isWalletExist = await this.walletService.getWalletById(walletId);
            if(!isWalletExist.response.status){
                return res.status(httpStatus.BAD_REQUEST).send({ "success": false, "message": "wallet not found!" });
            }

            console.log('walletData => ', isWalletExist.response.data.toJSON());

            const activity = await this.activityService.createActivity(req.body, userId);
            const { status, message, data } = activity.response;

            if(status){
                const walletData = isWalletExist.response.data;
                const adjustment = isIncome ? Number(amount) : -Number(amount);
                walletData.amount += adjustment;
                walletData.toJSON();
                await this.walletService.updateBalance(walletData.dataValues, walletId);
            }

            return res.status(activity.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            return res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = ActivityController;
