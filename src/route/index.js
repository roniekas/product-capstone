const express = require('express');
const authRoute = require('./authRoute');
const profileRoute = require('./profileRoute');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/profile',
        route: profileRoute
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
