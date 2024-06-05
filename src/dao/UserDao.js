const SuperDao = require('./SuperDao');
const models = require('../models');

const User = models.User;

class UserDao extends SuperDao {
    constructor() {
        super(User);
    }

    async findByUsername(username) {
        return User.findOne({ where: { username } });
    }

    async isUsernameExists(username) {
        return User.count({ where: { username } }).then((count) => {
            return count !== 0;
        });
    }

    async findAll(){
        return User.findAll();
    }
}

module.exports = UserDao;
