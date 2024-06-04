const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const UserDao = require('../dao/UserDao');
const TokenDao = require('../dao/TokenDao');
const { tokenTypes } = require('../config/tokens');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const RedisService = require('./RedisService');

class AuthService {
    constructor() {
        this.userDao = new UserDao();
        this.tokenDao = new TokenDao();
        this.redisService = new RedisService();
    }

    /**
     * Create a user
     * @param {String} username
     * @param {String} pin
     * @returns {Promise<{response: {code: *, message: *, status: boolean}, statusCode: *}>}
     */
    loginWithUserPin = async (username, pin) => {
        try {
            let message = 'Login Successful';
            let statusCode = httpStatus.OK;
            let user = await this.userDao.findByUsername(username);
            if (user == null) {
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    'Invalid Username!',
                );
            }

            const isPasswordValid = pin === user.pin;
            user = user.toJSON();
            delete user.pin;
            delete user.createdAt;
            delete user.updatedAt;

            if (!isPasswordValid) {
                statusCode = httpStatus.BAD_REQUEST;
                message = 'Wrong Pin!';
                return responseHandler.returnError(statusCode, message);
            }

            return responseHandler.returnSuccess(statusCode, message, user);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };

    logout = async (req, res) => {
        if(!req.body.refresh_token || !req.body.access_token) return false;
        const refreshTokenDoc = await this.tokenDao.findOne({
            token: req.body.refresh_token,
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });
        if (!refreshTokenDoc) {
            return false;
        }
        await this.tokenDao.remove({
            token: req.body.refresh_token,
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });
        await this.tokenDao.remove({
            token: req.body.access_token,
            type: tokenTypes.ACCESS,
            blacklisted: false,
        });
        this.redisService.removeToken(req.body.access_token, 'access_token');
        this.redisService.removeToken(req.body.refresh_token, 'refresh_token');
        return true;
    };
}

module.exports = AuthService;
