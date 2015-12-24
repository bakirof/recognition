export default function medianImage($rootScope, Filters) {
    'ngInject';
    return {
        restrict: 'E',
        templateUrl: 'app/components/median-image/median-image.html',
        link: (scope) => {
            scope.xy = Filters.xy;
            scope.repeat = 1;
            scope.medianElement = angular.element('#median-image');

            $rootScope.$on('grayscaled', (data) => {
                scope.originalGrayscaleData = {};
                scope.originalGrayscaleData.width = scope.grayscaleData.width;
                scope.originalGrayscaleData.height = scope.grayscaleData.height;
                scope.originalGrayscaleData.data = new Uint8Array(scope.grayscaleData.data.length);
                scope.originalGrayscaleData.data.set(scope.grayscaleData.data);
                if (data) {
                    scope.repeatApply();
                }
            });

            scope.repeatApply = () => {
                scope.grayscaleData.data.set(scope.originalGrayscaleData.data);
                for (var i = 0; i < scope.repeat; i++) {
                    scope.filt();
                }
                $rootScope.$emit('median', scope.grayscaleData);
            };

            scope.filt = () => {
                scope.xy = parseFloat(scope.xy);
                scope.repeat = parseFloat(scope.repeat);
                if (scope.xy && scope.repeat) {
                    angular.element('.median-img-canvas').remove();
                    Filters.setPixels(Filters.filterImage(Filters.median, scope.mainImage, scope.medianElement, scope.grayscaleData, scope.xy, scope.scale), scope.mainImage);
                }
            }
        }
    }
}
