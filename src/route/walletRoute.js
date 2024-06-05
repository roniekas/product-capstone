const express = require('express');
const WalletController = require('../controllers/WalletController');
const WalletValidator = require('../validator/WalletValidator');

const router = express.Router();
const auth = require('../middlewares/auth');

const walletController = new WalletController();
const walletValidator = new WalletValidator();

router.get(
    '/',
    auth(),
    walletController.getAllWallet
);

router.post(
    '/',
    auth(),
    walletValidator.newWalletValidator,
    walletController.newWallet
);

module.exports = router;
