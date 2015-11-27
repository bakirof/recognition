export default function inputFile($rootScope, Filters) {
  'ngInject';
  return {
    restrict: 'E',
    templateUrl: 'app/components/grayscale-image/grayscale-image.html',
    link: (scope)=> {
      var grayscaleImage = angular.element('#grayscale-image');

      $rootScope.$on('inputFile', ()=> {
        if (scope.mainImage) {
          angular.element(scope.mainImage).load(()=> {
            angular.element('.grayscale-img-canvas').remove();
            scope.grayscaleData = Filters.setPixels(Filters.filterImage(Filters.grayscale, scope.mainImage, grayscaleImage), scope.mainImage);
            console.log(scope.grayscaleData);
            $rootScope.$emit('grayscaled', scope.grayscaleData);
          });
        }
      });
    }
  };

}
