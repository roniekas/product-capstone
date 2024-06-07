const express = require('express');
const DetailController = require('../controllers/DetailController');
const DetailValidator = require('../validator/DetailValidator');

const router = express.Router();
const auth = require('../middlewares/auth');

const detailController = new DetailController();
const detailValidator = new DetailValidator();

router.post(
    '/transaksi',
    auth(),
    detailValidator.detailTrxValidator,
    detailController.detailTransaction
);

router.post(
    '/search',
    auth(),
    detailValidator.searchValidator,
    detailController.searchTransaction
);

module.exports = router;
