const SuperDao = require('./SuperDao');
const models = require('../models');

const Wallet = models.Wallet;

class WalletDao extends SuperDao {
    constructor() {
        super(Wallet);
    }

    async findByUserId(userId) {
        return Wallet.findAll({where: userId})
    }

    async isWalletExists(walletName) {
        return Wallet.count({ where: { walletName } }).then((count) => {
            return count !== 0;
        });
    }
}

module.exports = WalletDao;
