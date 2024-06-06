const express = require('express');
const ActivityController = require('../controllers/ActivityController');
const ActivityValidator = require('../validator/ActivityValidator');

const router = express.Router();
const auth = require('../middlewares/auth');

const activityController = new ActivityController();
const activityValidator = new ActivityValidator();

router.post(
    '/',
    auth(),
    activityValidator.createActivityValidator,
    activityController.addNewActivity
);

module.exports = router;
