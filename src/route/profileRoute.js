const express = require('express');
const ProfileController = require('../controllers/ProfileController');
const ProfileValidator = require('../validator/ProfileValidator');

const router = express.Router();
const auth = require('../middlewares/auth');

const profileController = new ProfileController();
const profileValidator = new ProfileValidator();

router.get('/', auth(), profileController.getUser);

router.put('/', auth(), profileValidator.updateProfileValidator, profileController.updateUser);

module.exports = router;
