export default function medianImage($rootScope, Filters) {
  'ngInject';
  return {
    restrict: 'E',
    templateUrl: 'app/components/median-image/median-image.html',
    link: (scope)=> {
      $rootScope.$on('grayscaled', (data)=>{
        if (data) {
          angular.element('.median-img-canvas').remove();
          var medianElement = angular.element('#median-image');
          console.log(data);
          Filters.setPixels(Filters.filterImage(Filters.median, scope.mainImage, medianElement, scope.grayscaleData), scope.mainImage);
        }
      });
    }
  }
}
