const SuperDao = require('./SuperDao');
const models = require('../models');

const Activity = models.Activity;

class ActivityDao extends SuperDao {
    constructor() {
        super(Activity);
    }

}

module.exports = ActivityDao;
