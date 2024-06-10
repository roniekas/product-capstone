const express = require('express');
const BillController = require('../controllers/BillController');
const BillValidator = require('../validator/BillValidator');

const router = express.Router();
const auth = require('../middlewares/auth');

const billController = new BillController();
const billValidator = new BillValidator();

router.post(
    '/readImages',
    auth(),
    billValidator.readImagesValidator,
    billController.readImages
);

router.post(
    '/processBill',
    auth(),
    billValidator.saveBillValidator,
    billController.saveBillController
);

module.exports = router;
