const httpStatus = require('http-status');
const BillService = require('../service/BillService');
const WalletService = require('../service/WalletService');
const ActivityService = require('../service/ActivityService');
const logger = require('../config/logger');
const { deleteFilesSync, deleteFilesAsync, transformRequestData } = require('../helper/general');

class BillController {
    constructor() {
        this.billService = new BillService();
        this.walletService = new WalletService();
        this.activityService = new ActivityService();
    }

    readImages = async (req, res) => {
        try {
            const { imageName, imagePath } = await this.billService.base64ToPng(req);

            if(!imageName){
                return res.status(httpStatus.BAD_REQUEST).send({ "status": false, "message": "Failed generating images" });
            }

            const readImageFromModel = await this.billService.readingImage(imagePath, imageName);
            const { isSuccess, data } = readImageFromModel;
            if(!isSuccess){
                logger.info(`${imageName}, is deleted due to failed reading images`);
                return res.status(httpStatus.BAD_REQUEST).send({ "status": false, "message": "Model failed to generate data" });
            }

            res.status(httpStatus.OK).send({ "status": true, "message" : "Success read data", data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    saveBillController = async (req, res) => {
        try {
            const {walletId, billId} = req.body;
            const userId = req.user.userId;

            const isWalletExist = await this.walletService.getWalletById(req.body.walletId);
            if(!isWalletExist.response.status){
                return res.status(httpStatus.BAD_REQUEST).send({ "status": false, "message": "Wallet not found!" });
            }

            const activityData = transformRequestData(req.body.items, walletId, billId, userId);

            const isSuccessAddActivity = await this.activityService.createMany(activityData);
            if(!isSuccessAddActivity){
                return res.status(httpStatus.BAD_REQUEST).send({ "status": false, "message": "Failed saving activity" });
            }

            const addBillData = await this.billService.createBill(billId, userId, req.body.billDetails);
            if(!addBillData){
                return res.status(httpStatus.BAD_REQUEST).send({ "status": false, "message": "Failed saving bill" });
            }

            return res.status(httpStatus.CREATED).send({ "status": true, "message": "Success adding bill" });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    checkHealth = async (req, res) => {
        return res.status(httpStatus.OK).send({ "status": "OK", "message": "Health Check" });
    }
}

module.exports = BillController;
