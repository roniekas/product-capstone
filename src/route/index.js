const express = require('express');
const authRoute = require('./authRoute');
const budgetRoute = require('./budgetRoute');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/budget',
        route: budgetRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
