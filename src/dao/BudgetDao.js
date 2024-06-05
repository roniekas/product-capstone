const SuperDao = require('./SuperDao');
const models = require('../models');

const Budget = models.Budget;

class BudgetDao extends SuperDao {
    constructor() {
        super(Budget);
    }

    async findByUsername(username) {
        return Budget.findOne({ where: { username } });
    }

    async isBudgetExists(userId, category, startDate, endDate) {
        return Budget.count({ where: { userId, category, startDate, endDate } }).then((count) => {
            return count !== 0;
        });
    }
}

module.exports = BudgetDao;
