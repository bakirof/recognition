export default function inputFile($rootScope, Filters) {
  'ngInject';
  return {
    restrict: 'E',
    templateUrl: 'app/components/grayscale-image/grayscale-image.html',
    link: (scope)=> {
      scope.scale = 1;
      scope.defaultGrayscaleImage = angular.element('#grayscale-image');

      $rootScope.$on('inputFile', ()=> {
        if (scope.mainImage) {
          angular.element(scope.mainImage).load(()=> {
            scope.toGray();
          });
        }
      });
      scope.toGray = ()=> {
        scope.scale = parseFloat(scope.scale);
        if (scope.scale){
          angular.element('.grayscale-img-canvas').remove();
          scope.grayscaleData = Filters.setPixels(Filters.filterImage(Filters.grayscale, scope.mainImage, scope.defaultGrayscaleImage, 0, 0, scope.scale), scope.mainImage);
          $rootScope.$emit('grayscaled', scope.grayscaleData);
        }
      }
    }
  };

}
