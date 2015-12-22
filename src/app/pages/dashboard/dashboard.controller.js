export default
class DashboardController {
  constructor($scope){
    'ngInject';
    $scope.isFirstOpen = true;
    $scope.$watch('isFirstOpen', ()=>{
      alert('changed');
      $scope.apply();
    });
  }
}
