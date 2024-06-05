const SuperDao = require('./SuperDao');
const models = require('../models');
const moment = require('moment');
const { Op, Sequelize } = require('sequelize');

const Budget = models.Budget;

class BudgetDao extends SuperDao {
    constructor() {
        super(Budget);
    }

    async isBudgetExists(userId, category, startDate, endDate) {
        return Budget.count({
            where: {
                userId,
                category,
                startDate: {
                    [Sequelize.Op.eq]: Sequelize.literal(`DATE('${startDate}')`), // Use Sequelize.literal to prevent conversion
                },
                endDate: {
                    [Sequelize.Op.eq]: Sequelize.literal(`DATE('${endDate}')`), // Use Sequelize.literal to prevent conversion
                },
            },
        }).then((count) => {
            return count !== 0;
        });
    }
}

module.exports = BudgetDao;
