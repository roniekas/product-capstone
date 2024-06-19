const moment = require('moment');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

function getDateRange(rangeType, sequence = 1, date = moment()) {
    const ranges = [];

    for (let i = 0; i < sequence; i++) {
        let startDate;
        let endDate;
        const currentDate = moment();

        switch (rangeType) {
            case 'day':
                startDate = currentDate.clone().startOf('day');
                endDate = currentDate.clone().endOf('day');
                break;
            case 'week':
                startDate = currentDate.clone().startOf('isoWeek');
                endDate = currentDate.clone().endOf('isoWeek');
                break;
            case 'month':
                startDate = currentDate.clone().startOf('month');
                endDate = currentDate.clone().endOf('month');
                break;
            case 'quarter':
                startDate = currentDate.clone().startOf('quarter');
                endDate = currentDate.clone().endOf('quarter');
                break;
            case 'year':
                startDate = currentDate.clone().startOf('year');
                endDate = currentDate.clone().endOf('year');
                break;
            default:
                throw new Error('Invalid range type');
        }

        ranges.push({
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
        });
    }

    return ranges;
}

function reformatActivity(activity) {
    return {
        ...activity.dataValues,
        activityType: activity.dataValues.activityType ? 'income' : 'outcome',
    };
}

const processActivityData = (dailyActivity, type, byCategory, isMoreThanOneMonth) => {
    const dataReducer = (accumulator, activity) => {
        const keyFormat = isMoreThanOneMonth ? 'YYYY-MM' : 'YYYY-MM-DD';
        const key = byCategory ? activity.category : moment(activity.date).format(keyFormat); // Define key based on grouping preference
        const isIncome = type === 'income';
        const isAllActivity = type === 'all';

        if (!accumulator[key]) {
            accumulator[key] = {
                activities: [],
                income: 0,
                outcome: 0,
            };
        }

        const reformattedActivity = reformatActivity(activity);
        accumulator[key].activities.push(reformattedActivity);

        if (isAllActivity || (isIncome && reformattedActivity.activityType === 'income')) {
            accumulator[key].income += reformattedActivity.amount;
        }

        if (isAllActivity || (!isIncome && reformattedActivity.activityType !== 'income')) {
            accumulator[key].outcome += reformattedActivity.amount;
        }

        return accumulator;
    };

    const processData = () => {
        const data = dailyActivity.reduce((accumulator, activity) => dataReducer(accumulator, activity), {});

        if (type === 'all') {
            const totalIncome = Object.values(data).reduce((sum, item) => sum + item.income, 0);
            const totalOutcome = Object.values(data).reduce((sum, item) => sum + item.outcome, 0);
            const rangeSummary = totalIncome - totalOutcome;
            return { data, summaries: { income: totalIncome, outcome: totalOutcome, rangeSummary } };
        }

        return { data };
    };

    return processData();
};

const generateStartAndEndDate = (yearMonth) => {
    let date = moment(yearMonth, 'YYYY-MM', true);

    if (!date.isValid()) {
        date = moment(yearMonth);
        if (!date.isValid()) {
            date = moment();
        }
    }

    const startDate = date.startOf('month').format('YYYY-MM-DD');
    const endDate = date.endOf('month').format('YYYY-MM-DD');
    return { startDate, endDate };
};

const randomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBillDetails(totalPrice){
    return {
        billName: `Bill-${Math.random().toString(36).substring(2, 10)}`,
        tax: 0,
        serviceCharge: 0,
        discount: 0,
        others: 0,
        grandTotal: totalPrice
    };
}

async function deleteFilesAsync(imageNames) {
    const deletePromises = imageNames.map(async (imageName) => {
        const tmpDir = path.join(__dirname, '../..', '/src/tmp/');
        console.log('asd => ', tmpDir+imageName);
        fs.unlink(tmpDir+imageName, function(err) {
            if (err) {
                logger.error('error deleting files => ', err.code);
            } else {
                logger.info("Successfully deleted the file.");
            }
        })
    });

    await Promise.all(deletePromises);
}

function transformRequestData(requestData, walletId, billId, userId) {
    const transactions = [];

    for (const category in requestData) {
        for (const item in requestData[category]) {
            transactions.push({
                activityId: uuidv4(),
                userId: userId,
                amount: requestData[category][item],
                activityType: false,
                category: category,
                notes: item,
                date: new Date().toISOString().slice(0, 10),
                walletId: walletId,
                iconId: "",
                billId: billId
            });
        }
    }

    return transactions;
}


module.exports = {
    getDateRange,
    reformatActivity,
    generateStartAndEndDate,
    randomNumber,
    deleteFilesAsync,
    transformRequestData,
    generateBillDetails
};

