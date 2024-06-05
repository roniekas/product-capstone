const express = require('express');
const BudgetController = require('../controllers/BudgetController');
const BudgetValidator = require('../validator/BudgetValidator');

const router = express.Router();
const auth = require('../middlewares/auth');

const budgetController = new BudgetController();
const budgetValidator = new BudgetValidator();

router.get(
    '/',
    auth(),
    budgetController.getAllBudget
);
router.post(
    '/',
    auth(),
    budgetValidator.createBudgetValidator,
    budgetController.newBudget
);
router.put(
    '/',
    auth(),
    budgetValidator.updateBudgetValidator,
    budgetController.updateBudget
);
router.delete(
    '/',
    auth(),
    budgetController.deleteBudget
);

module.exports = router;
