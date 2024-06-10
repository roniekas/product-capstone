const SuperDao = require('./SuperDao');
const models = require('../models');

const Bill = models.Bill;

class BillDao extends SuperDao {
    constructor() {
        super(Bill);
    }
}

module.exports = BillDao;
