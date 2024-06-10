const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const WalletDao = require('../dao/WalletDao');
const BillDao = require('../dao/BillDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const fs = require('fs');
const path = require('path');
const { randomNumber, generateRandomResult, deleteFilesAsync } = require('../helper/general');

class BillService {
    constructor() {
        this.walletDao = new WalletDao();
        this.billDao = new BillDao();
    }

    /**
     * Create a user
     * @param billId
     * @param userId
     * @param {Object} data
     * @returns {Object}
     */
    createBill = async (billId, userId, data) => {
        try {
            let message = 'Successfully Create the wallet!';
            data.billId = billId;
            data.userId = userId;
            console.log('datasu => ', data);
            let walletData = await this.billDao.create(data);

            return responseHandler.returnSuccess(httpStatus.CREATED, message, walletData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };

    base64ToPng = async (req) => {
        let userId = req.user.userId ?? '';
        userId = userId.replace(/-/g, '');

        let data = req.body.images;
        data = data.replace(/^data:image\/png;base64,/, '');

        const timestamp = Date.now();
        const imageName = `${userId}-${timestamp}.png`;

        const imagePath = path.resolve(__dirname, '../tmp', imageName);

        fs.writeFile(imagePath, data, 'base64', function(err) {
            if (err) {
                console.error('Error saving image:', err);
                return null;
            }
        });
        return imageName;
    }

    readingImage = async (image) => {
        let isSuccess = true;
        let data = {};
        const number = randomNumber(1, 10);
        if(number < 5){
            isSuccess = false;
            return {isSuccess, data}
        }

        data = generateRandomResult(image);

        return {isSuccess, data}
    }

    uploadToBucket = async (image) => {
        logger.info(`${image}, successfully uploaded`);
        logger.info(`${image}, will be deleted due to successfully upload`);
        await deleteFilesAsync([image]);
    }
}

module.exports = BillService;
