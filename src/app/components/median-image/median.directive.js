export default function medianImage($rootScope, Filters) {
  'ngInject';
  return {
    restrict: 'E',
    templateUrl: 'app/components/median-image/median-image.html',
    link: (scope)=> {
      scope.xy = Filters.xy;
      scope.repeat = 1;
      scope.medianElement = angular.element('#median-image');

      $rootScope.$on('grayscaled', (data)=> {
        scope.originalGrayscaleData = new Uint8Array(scope.grayscaleData.data.length);
        scope.originalGrayscaleData.set(scope.grayscaleData.data);
        if (data) {
          scope.repeatApply();
        }
      });

      scope.repeatApply = ()=> {
        scope.grayscaleData.data.set(scope.originalGrayscaleData);
        for (var i = 0; i < scope.repeat; i++) {
          scope.filt();
        }
      };


      scope.filt = ()=> {
        if (scope.xy && scope.repeat) {
          angular.element('.median-img-canvas').remove();
          Filters.setPixels(Filters.filterImage(Filters.median, scope.mainImage, scope.medianElement, scope.grayscaleData, scope.xy, scope.scale), scope.mainImage);
        }
      }
    }
  }
}
