import router from './config/router.js';
require('./pages');
angular.module('bakirov', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router', 'ui.bootstrap', 'bakirov.pages'])
.config(router);
