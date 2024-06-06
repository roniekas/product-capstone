const express = require('express');
const authRoute = require('./authRoute');
const activityRoute = require('./activityRoute');
const budgetRoute = require('./budgetRoute');
const walletRoute = require('./walletRoute');
const detailRoute = require('./detailRoute');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/activity',
        route: activityRoute,
    },
    {
        path: '/budget',
        route: budgetRoute,
    },
    {
        path: '/wallet',
        route: walletRoute,
    },
    {
        path: '/detail',
        route: detailRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
