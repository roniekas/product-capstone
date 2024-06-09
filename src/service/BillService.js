const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const WalletDao = require('../dao/WalletDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class BillService {
    constructor() {
        this.walletDao = new WalletDao();
    }

    /**
     * Create a user
     * @param {Object} userBody
     * @param req
     * @param res
     * @returns {Object}
     */
    createWallet = async (userBody, req, res) => {
        try {
            let message = 'Successfully Create the wallet!';
            if (await this.walletDao.isWalletExists(userBody.walletName)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Wallet Already Exist!');
            }

            userBody.walletId = uuidv4();
            userBody.userId = req.user.userId;

            let walletData = await this.walletDao.create(userBody);

            if (!walletData) {
                message = 'Crating Wallet Failed! Please Try again.';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }

            walletData = walletData.toJSON();

            delete walletData.createdAt;
            delete walletData.updatedAt;

            return responseHandler.returnSuccess(httpStatus.CREATED, message, walletData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };

    getAllWallet = async (userId) => {
        try {
            let message = 'This is the all wallet'
            let walletData = await this.walletDao.findByUserId(userId);

            if (!walletData) {
                message = 'Failed! Please Try again.';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }

            if(walletData.length !== 0) {
                walletData = walletData.map(wallet => {
                    const { createdAt, updatedAt, ...rest } = wallet.dataValues;
                    return rest;
                });
                delete walletData.createdAt;
                delete walletData.updatedAt;
            } else if (walletData.length === 0) {
                message = "you didn't have any wallet"
            }


            return responseHandler.returnSuccess(httpStatus.OK, message, walletData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    }


    getWalletById = async (walletId) => {
        try {
            let message = 'This is the all wallet';
            const isWalletExist = await this.walletDao.findOneByWhere({walletId});
            if(isWalletExist){
                return responseHandler.returnSuccess(httpStatus.OK, message, isWalletExist);
            } else {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Wallet not found');
            }
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    }

    updateBalance = async (data, walletId) => {
        try {
            let message = 'This is the all wallet';
            const isWalletExist = await this.walletDao.updateWhere(data, { walletId });

            if(isWalletExist){
                return responseHandler.returnSuccess(httpStatus.OK, message, isWalletExist);
            } else {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Wallet not found');
            }
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    }
}

module.exports = BillService;
