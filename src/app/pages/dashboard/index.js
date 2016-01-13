import DashboardController from './dashboard.controller';
import FiltersService from './filters.service';
import FiltersConstantsService from './filters-constants.service';
export default angular.module('bakirov.pages.dashboard', [])
  .controller('DashboardController', DashboardController)
  .service('Filters', FiltersService)
  .service('FiltersConstants', FiltersConstantsService);
