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

function generateRandomResult() {
    const menu = {
        "food": {
            "Nasi Goreng Spesial": 25000,
            "Ayam Bakar Madu": 30000,
            "Mie Goreng Jawa": 20000,
            "Sate Ayam Madura": 28000,
            "Gado-Gado": 18000
        },
        "drink": {
            "Es Teh Manis": 8000,
            "Es Jeruk Peras": 12000,
            "Kopi Susu": 15000,
            "Jus Alpukat": 20000,
            "Wedang Jahe": 10000
        },
        "entertainment": {
            "Tiket Bioskop": 50000,
            "Tiket Konser Musik": 150000,
            "Permainan Arcade": 5000,
            "Paket Karaoke Keluarga": 200000,
            "Pameran Seni": 30000
        },
        "health": {
            "Konsultasi Dokter Umum": 100000,
            "Paket Medical Checkup": 500000,
            "Vitamin C": 30000,
            "Obat Sakit Kepala": 15000,
            "Sesi Fisioterapi": 80000
        }
    };

    const categories = Object.keys(menu);
    const numCategories = Math.floor(Math.random() * categories.length) + 1;
    const selectedCategories = [];

    while (selectedCategories.length < numCategories) {
        const randomIndex = Math.floor(Math.random() * categories.length);
        const category = categories[randomIndex];
        if (!selectedCategories.includes(category)) {
            selectedCategories.push(category);
        }
    }

    const result = {};
    for (const category of selectedCategories) {
        const items = Object.keys(menu[category]);
        const numItems = Math.floor(Math.random() * items.length) + 1;
        const selectedItems = {};

        while (Object.keys(selectedItems).length < numItems) {
            const randomIndex = Math.floor(Math.random() * items.length);
            const item = items[randomIndex];
            if (!selectedItems.hasOwnProperty(item)) {
                selectedItems[item] = menu[category][item];
            }
        }

        result[category] = selectedItems;
    }
    const billDetails = {
        billName: `Bill-${Math.random().toString(36).substring(2, 10)}`,
        tax: randomNumber(1000, 5000),
        serviceCharge: randomNumber(5000, 10000),
        discount: randomNumber(0, 10000),
        others: randomNumber(0, 3000)
    };

    let subtotal = 0;
    for (const category in result) {
        for (const item in result[category]) {
            subtotal += result[category][item];
        }
    }
    billDetails.grandTotal = subtotal + billDetails.tax + billDetails.serviceCharge - billDetails.discount + billDetails.others;

    result.billDetails = billDetails;

    return result;
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
    generateRandomResult,
    deleteFilesAsync,
    transformRequestData
};

