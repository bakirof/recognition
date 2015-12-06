import router from './config/router.js';
require('./pages');
require('./components');
angular.module('bakirov', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router', 'ui.bootstrap', 'bakirov.pages', 'bakirov.components', 'nvd3'])
.config(router);
