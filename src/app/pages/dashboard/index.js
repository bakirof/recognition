import DashboardController from './dashboard.controller';
import FiltersService from './filters.service';
export default angular.module('bakirov.pages.dashboard', [])
  .controller('DashboardController', DashboardController)
  .service('Filters', FiltersService);
