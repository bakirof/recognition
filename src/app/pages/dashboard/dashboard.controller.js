export default
class DashboardController {
  constructor($scope){
    'ngInject';
    $scope.isFirstOpen = true;
    this.scope = $scope;
  }
  updateCanvas(min, max){
      this.scope.clearCanvas();
      this.scope.updateArrows(min, max);
  }
}
