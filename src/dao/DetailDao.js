const SuperDao = require('./SuperDao');
const models = require('../models');
const { Sequelize } = require('sequelize');
const moment = require('moment');
const { reformatActivity } = require('../helper/general');

const Activity = models.Activity;

class DetailDao extends SuperDao {
    constructor() {
        super(Activity);
    }

    detailedSearch = async (userId, startDate, endDate, byCategory = true, type = 'all') => {
        const dailyActivity =  await Activity.findAll({
            attributes: [
                'activityType',
                [Sequelize.fn('DATE', Sequelize.col('date')), 'date'],
                'category',
                'notes',
                'amount',
            ],
            where: {
                userId,
                date: {
                    [Sequelize.Op.gte]: Sequelize.literal(`DATE('${startDate}')`), // Compare dates directly
                    [Sequelize.Op.lte]: Sequelize.literal(`DATE('${endDate}')`), // Compare dates directly
                },
                activityType: type !== 'all' ? type === 'income' : { [Sequelize.Op.not]: null },
            }
        });

        const key = byCategory ? 'category' : 'date';
        const startMoment = moment(startDate);
        const endMoment = moment(endDate);
        const isMoreThanOneMonth = endMoment.diff(startMoment, 'months') > 0;
        const isAllActivity = type === 'all';
        const isIncome = type === 'income';

        if (isMoreThanOneMonth) {
            const monthlyData = dailyActivity.reduce((acc, activity) => {
                const monthKey = moment(activity.date).format('YYYY-MM');
                if (!acc[monthKey]) {
                    acc[monthKey] = {
                        activities: [],
                    };
                    if (isAllActivity || isIncome) {
                        acc[monthKey].income = 0;
                    }
                    if (isAllActivity || !isIncome) {
                        acc[monthKey].outcome = 0;
                    }
                }
                const reformattedActivity = reformatActivity(activity);
                acc[monthKey].activities.push(reformattedActivity);

                if (isAllActivity || isIncome) {
                    if (reformattedActivity.activityType === 'income') {
                        acc[monthKey].income += reformattedActivity.amount;
                    }
                }
                if (isAllActivity || !isIncome) {
                    if (reformattedActivity.activityType !== 'income') {
                        acc[monthKey].outcome += reformattedActivity.amount;
                    }
                }
                return acc;
            }, {});

            if (byCategory) {
                for (const monthKey in monthlyData) {
                    const categories = {};
                    for (const activity of monthlyData[monthKey].activities) {
                        const category = activity[key];
                        categories[category] = categories[category] || [];
                        categories[category].push(activity);
                    }
                    monthlyData[monthKey].activities = categories;
                }
            }

            if (isAllActivity) {
                for (const monthKey in monthlyData) {
                    monthlyData[monthKey].rangeSummary = monthlyData[monthKey].income - monthlyData[monthKey].outcome;
                }
            }

            return monthlyData;
        } else {
            const dailyData = dailyActivity.reduce((acc, activity) => {
                const key = moment(activity.date).format('YYYY-MM-DD');
                if (!acc[key]) {
                    acc[key] = {
                        activities: [],
                    };
                    if (isAllActivity || isIncome) {
                        acc[key].income = 0;
                    }
                    if (isAllActivity || !isIncome) {
                        acc[key].outcome = 0;
                    }
                }
                const reformattedActivity = reformatActivity(activity);
                acc[key].activities.push(reformattedActivity);

                if (isAllActivity || isIncome) {
                    if (reformattedActivity.activityType === 'income') {
                        acc[key].income += reformattedActivity.amount;
                    }
                }
                if (isAllActivity || !isIncome) {
                    if (reformattedActivity.activityType !== 'income') {
                        acc[key].outcome += reformattedActivity.amount;
                    }
                }
                return acc;
            }, {});

            for (const dayKey in dailyData) {
                dailyData[dayKey].rangeSummary = dailyData[dayKey].income - dailyData[dayKey].outcome;
            }

            return dailyData;
        }
    }
}

module.exports = DetailDao;
