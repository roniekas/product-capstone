const SuperDao = require('./SuperDao');
const models = require('../models');
const moment = require('moment');
const { Op } = require('sequelize');

const Budget = models.Budget;

class BudgetDao extends SuperDao {
    constructor() {
        super(Budget);
    }

    async findByUsername(username) {
        return Budget.findOne({ where: { username } });
    }

    async isBudgetExists(userId, category, cvStartDate, cvEndDate) {
        const condition = {
            userId,
            category,
            startDate: {
                [Op.eq]: moment(cvStartDate).utc().format('YYYY-MM-DD')
            },
            endDate: {
                [Op.eq]: moment(cvEndDate).utc().format('YYYY-MM-DD')
            }
        }
        return Budget.count({ where: condition }).then((count) => {
            return count !== 0;
        });
    }
}

module.exports = BudgetDao;
