const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const WalletDao = require('../dao/WalletDao');
const BillDao = require('../dao/BillDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const fs = require('fs');
const path = require('path');
const { deleteFilesAsync, generateBillDetails } = require('../helper/general');
const axios = require('axios');
const {Storage} = require('@google-cloud/storage');
const fsa = require('node:fs/promises');

class BillService {
    constructor() {
        this.walletDao = new WalletDao();
        this.billDao = new BillDao();
    }

    readFromML = async (filePath, fileName) => {
        let imageBuffer;
        try {
            imageBuffer = await fsa.readFile(filePath);
        } catch (err) {
            console.error("Error reading file:", err);
        }

        const myBuffer = Buffer.from(imageBuffer);
        const blob = new Blob([myBuffer], { type: 'image/jpg' });
        const formData = new FormData();

        formData.set('image', blob, fileName);
        let returnedData;

        await axios.post('https://ml-syb-image-ytpe6qeg4a-uc.a.run.app/process', formData, {
            headers: {
                'Content-Type': "image/png"
            },
            cache: false,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        })
            .then(response => {
                console.log('data => ', response.data);
                returnedData = response.data;
            })
            .catch(error => {
                console.error('error => ', error);
                returnedData = 'ERROR_READING_MODEL';
            });

        return returnedData;
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

        let imageData = req.body.images;

        const matches = imageData.match(/^data:image\/([a-z]+);base64,/);
        const fileExtension = matches ? matches[1] : 'png';

        imageData = imageData.replace(/^data:image\/[a-z]+;base64,/, '');

        const timestamp = Date.now();
        const imageName = `${userId}-${timestamp}.${fileExtension}`;

        const imagePath = path.resolve(__dirname, '../tmp', imageName);

        fs.writeFile(imagePath, imageData, 'base64', function(err) {
            if (err) {
                console.error('Error saving image:', err);
                return null;
            }
        });

        return { imageName, imagePath };
    };

    readingImage = async (imagePath, imageName) => {
        let isSuccess = true;
        let data = {};
        const modelResult = await this.readFromML(imagePath, imageName);

        if(!modelResult.items){
            isSuccess = false;
            data = 'failed reading models';
            return {isSuccess, data}
        }

        modelResult.items.forEach(item => {
            const category = item.category;
            const itemName = item.name;
            const price = item.price;
            if (!data[category]) {
                data[category] = {};
            }
            data[category][itemName] = price;
        });

        data.billDetails = generateBillDetails(modelResult.totals ?? 0);

        return {isSuccess, data}
    }
}

module.exports = BillService;
