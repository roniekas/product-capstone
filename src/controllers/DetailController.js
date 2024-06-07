const httpStatus = require('http-status');
const DetailService = require('../service/DetailService');
const logger = require('../config/logger');
const moment = require('moment');


class DetailController {
    constructor() {
        this.detailService = new DetailService();
    }

    detailTransaction = async (req, res) => {
        try {
            let {startDate, endDate} = req.body;
            if( !moment(startDate, 'YYYY-MM-DD', true).isValid() || !moment(endDate, 'YYYY-MM-DD', true).isValid()){
                return res.status(httpStatus.BAD_REQUEST).send({ "status": false, "message": "wrond date format, expected YYYY-MM-DD" });
            }
            const user = await this.detailService.detailedTransaction(req);

            const { status, message, data } = user.response;
            res.status(user.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    searchTransaction = async (req, res) => {
        try {
            const user = await this.detailService.searchTransaction(req);

            const { status, message, data } = user.response;
            res.status(user.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    homePage = async (req, res) => {
        try {
            const user = await this.detailService.homePage(req);

            const { status, message, data } = user.response;
            res.status(user.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = DetailController;
