const express = require('express');
const BillController = require('../controllers/BillController');
const BillValidator = require('../validator/BillValidator');

const router = express.Router();
const auth = require('../middlewares/auth');

const billController = new BillController();
const billValidator = new BillValidator();

router.get(
    '/',
    auth(),
);

router.post(
    '/',
    auth(),
);

module.exports = router;
