export default  function filterF1($rootScope, Filters) {
    'ngInject';
    return {
        restrict: 'E',
        templateUrl: 'app/components/filter-f1/filter-f1.html',
        link: (scope) => {
            scope.width = 4;
            scope.dx = 1;
            $rootScope.$on('median', (event, data) => {
                scope.filterF1();
            });
            scope.filterF1 = () => {
                scope.width = parseFloat(scope.width);
                scope.dx = parseFloat(scope.dx);
                if (scope.width && scope.dx) {
                    scope.updateChart(Filters.filterF1(scope.grayscaleData, scope.width, scope.dx));
                }
            };
            scope.allFilters = () => {
                var combinations = [];
                scope.min = parseFloat(scope.min);
                scope.max = parseFloat(scope.max);
                if ((scope.min || scope.min === 0) && (scope.max === 0 || scope.max)) {
                    scope.extremums.filtered = scope.extremums.allExtremums.filter((val) => val.x > scope.min && val.x < scope.max);
                    for (var i = 0; i < scope.extremums.filtered.length; i++) {
                        for (var j = 1; j < scope.extremums.filtered.length - i; j++) {
                            combinations.push({ min: scope.extremums.filtered[i].x, max: scope.extremums.filtered[j + i].x });
                        }
                    }
                    combinations.forEach((combination)=>{
                        combination.filters = Filters.applyMainFilters(scope.originalGrayscaleData, combination.min, combination.max);
                    });
                    console.log(scope.extremums.filtered);
                    console.log(combinations);
                    //Filters.applyMainFilters(scope.originalGrayscaleData);
                };
            };
            scope.updateChart = (points) => {
                scope.data = [
                    {
                        key: "Y",
                        values: points,
                        color: '#006064'
                    }
                ];
                scope.extremums = Filters.findExtremums(points);
                $rootScope.$emit('newdata', scope.data);
            };
        }
    };
}
