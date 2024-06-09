const httpStatus = require('http-status');
const WalletService = require('../service/WalletService');
const logger = require('../config/logger');

class BillController {
    constructor() {
        this.walletService = new WalletService();
    }

    newWallet = async (req, res) => {
        try {
            const wallet = await this.walletService.createWallet(req.body, req, res);
            const { status, message, data } = wallet.response;

            res.status(wallet.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getAllWallet = async (req, res) => {
        try {
            const userId = req.user.userId ?? '';
            const allWallet = await this.walletService.getAllWallet({ userId })
            const { status, message, data } = allWallet.response;

            res.status(allWallet.statusCode).send({ status, message, data });
        } catch (e){
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }
}

module.exports = BillController;
