const httpStatus = require('http-status');
const DetailDao = require('../dao/DetailDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class DetailService {
    constructor() {
        this.detailDao = new DetailDao();
    }

    /**
     * Create a user
     * @param req
     * @returns {Object}
     */
    detailedTransaction = async (req) => {
        try {
            let message = 'nih';
            const userId = req.user.userId ?? '';
            let {startDate, endDate, byCategory, type} = req.body;

            let walletData = await this.detailDao.detailedSearch(userId, startDate, endDate, byCategory, type);

            return responseHandler.returnSuccess(httpStatus.CREATED, message, walletData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };
}

module.exports = DetailService;
