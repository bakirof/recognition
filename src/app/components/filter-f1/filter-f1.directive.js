export default  function filterF1($rootScope) {
  'ngInject';
  return {
    restrict: 'E',
    templateUrl: 'app/components/filter-f1/filter-f1.html',
    link: (scope)=> {
      $rootScope.$on('median', ()=> {

      });
    }
  };
}
