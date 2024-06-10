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
            const writeImage = await this.billService.base64ToPng(req);

            if(!writeImage){
                return res.status(httpStatus.BAD_REQUEST).send({ "status": false, "message": "failed to generate Images" });
            }

            const readImageFromModel = await this.billService.readingImage(writeImage);
            const { isSuccess, data } = readImageFromModel;
            if(!isSuccess){
                logger.info(`${writeImage}, is deleted due to failed reading images`);
                await deleteFilesAsync([writeImage]);
                return res.status(httpStatus.BAD_REQUEST).send({ "status": false, "message": "model failed to generate data" });
            }

            await this.billService.uploadToBucket(writeImage);
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
                return res.status(httpStatus.BAD_REQUEST).send({ "status": false, "message": "wallet not found!" });
            }

            const activityData = transformRequestData(req.body.items, walletId, billId, userId);

            const isSuccessAddActivity = await this.activityService.createMany(activityData);
            if(!isSuccessAddActivity){
                return res.status(httpStatus.BAD_REQUEST).send({ "status": false, "message": "failed to save activity" });
            }

            const addBillData = await this.billService.createBill(billId, userId, req.body.billDetails);
            if(!addBillData){
                return res.status(httpStatus.BAD_REQUEST).send({ "status": false, "message": "failed to save bill" });
            }

            return res.status(httpStatus.CREATED).send({ "status": true, "message": "success add bill" });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    checkHealth = async (req, res) => {
        return res.status(httpStatus.OK).send({ "status": "OK", "message": "health check" });
    }
}

module.exports = BillController;
