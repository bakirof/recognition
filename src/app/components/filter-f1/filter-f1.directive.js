export default  function filterF1($rootScope, Filters) {
  'ngInject';
  return {
    restrict: 'E',
    templateUrl: 'app/components/filter-f1/filter-f1.html',
    link: (scope)=> {
      scope.width = 4;
      scope.dx = 1;
      $rootScope.$on('median', ()=> {
        scope.filterF1();
      });
      scope.filterF1 = ()=>{
        scope.updateChart(Filters.filterF1(scope.grayscaleData, scope.width, scope.dx));
      };
      scope.updateChart = (points)=> {
        scope.data = [
          {
            key: "График",
            values: points,
            color: '#006064'
          }
        ];
        scope.api.updateWithData(scope.data);
      };
    }
  };
}
