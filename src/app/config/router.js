function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/pages/dashboard/dashboard.html',
      controller: 'DashboardController',
      controllerAs: 'vm'
    });

  $urlRouterProvider.otherwise('/');
}

export default routerConfig;
