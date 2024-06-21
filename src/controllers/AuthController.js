const httpStatus = require('http-status');
const AuthService = require('../service/AuthService');
const TokenService = require('../service/TokenService');
const UserService = require('../service/UserService');
const logger = require('../config/logger');
const { tokenTypes } = require('../config/tokens');

class AuthController {
    constructor() {
        this.userService = new UserService();
        this.tokenService = new TokenService();
        this.authService = new AuthService();
    }

    register = async (req, res) => {
        try {
            const user = await this.userService.createUser(req.body);
            let tokens = {};
            const { status } = user.response;
            if (user.response.status) {
                tokens = await this.tokenService.generateAuthTokens(user.response.data);
            }

            const { message, data } = user.response;
            res.status(user.statusCode).send({ status, message, data, tokens });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    check = async (req, res) => {
        try {
            const user = await this.userService.checkUser(req.body);
            const { status } = user.response;

            const { message, data } = user.response;
            res.status(user.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    checkEmail = async (req, res) => {
        try {
            const isExists = await this.userService.isEmailExists(req.body.email.toLowerCase());
            res.status(isExists.statusCode).send(isExists.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    login = async (req, res) => {
        try {
            const { username, pin } = req.body;
            const user = await this.authService.loginWithUserPin(
                username,
                pin,
            );
            const { message } = user.response;
            const { data } = user.response;
            const { status } = user.response;
            const code = user.statusCode;
            let tokens = {};
            if (user.response.status) {
                tokens = await this.tokenService.generateAuthTokens(data);
            }
            res.status(user.statusCode).send({ status, code, message, data, tokens });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    logout = async (req, res) => {
        let status = true;
        let code = 200;
        let message = "Success Logout";

        const isSuccess = await this.authService.logout(req, res);

        if(!isSuccess){
            status = false;
            code = 400;
            message = "failed to logout";
            res.status(httpStatus.BAD_REQUEST).send({status, code, message});
        } else if (isSuccess) {
            res.status(httpStatus.OK).send({status, code, message});
        }

        res.status(httpStatus.BAD_GATEWAY);
    };

    refreshTokens = async (req, res) => {
        try {
            const refreshTokenDoc = await this.tokenService.verifyToken(
                req.body.refresh_token,
                tokenTypes.REFRESH,
            );
            const user = await this.userService.getUserByUuid(refreshTokenDoc.user_uuid);
            if (user == null) {
                res.status(httpStatus.BAD_GATEWAY).send('User Not Found!');
            }
            await this.tokenService.removeTokenById(refreshTokenDoc.id);
            const tokens = await this.tokenService.generateAuthTokens(user);
            res.send(tokens);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    changePassword = async (req, res) => {
        try {
            const responseData = await this.userService.changePassword(req.body, req.user.userId);
            res.status(responseData.statusCode).send(responseData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = AuthController;
