export default  function filterF1($rootScope, Filters, FiltersConstants) {
    'ngInject';
    return {
        restrict: 'E',
        templateUrl: 'app/components/filter-f1/filter-f1.html',
        link: (scope) => {
            scope.width = 4;
            scope.dx = 1;
            scope.min = 0;
            scope.max = 120;
            $rootScope.$on('median', (event, data) => {
                scope.filterF1();
            });
            scope.filterF1 = () => {
                scope.width = parseFloat(scope.width);
                scope.dx = parseFloat(scope.dx);
                if (scope.width && scope.dx) {
                    scope.updateChart(Filters.filterF1(scope.grayscaleData, scope.width, scope.dx));
                    scope.allFilters();
                }
            };
            scope.allFilters = () => {
                scope.combinations = [];
                scope.min = parseFloat(scope.min);
                scope.max = parseFloat(scope.max);
                if ((scope.min || scope.min === 0) && (scope.max === 0 || scope.max)) {
                    scope.extremums.filtered = scope.extremums.allExtremums.filter((val) => val.x > scope.min && val.x < scope.max);
                    for (var i = 0; i < scope.extremums.filtered.length; i++) {
                        for (var j = 1; j < scope.extremums.filtered.length - i; j++) {
                            if (scope.extremums.filtered[j + i].x - scope.extremums.filtered[i].x >= 4) {
                                scope.combinations.push({ min: scope.extremums.filtered[i].x, max: scope.extremums.filtered[j + i].x });
                            }
                        }
                    }
                    scope.combinations.forEach((combination, i) => {
                        combination.filters = Filters.applyMainFilters(scope.originalGrayscaleData, combination.min, combination.max);
                    });
                    if (scope.combinations.length > 0) {
                        scope.calculateDistance();
                    }
                };
            };

            scope.calculateDistance = () => {
                var distances;
                var tmpDistance;
                var minDistance;
                scope.combinations.forEach((combination) => {
                    distances = [];
                    for (var key2 in FiltersConstants.words[scope.imageFileName]) {
                        tmpDistance = 0;
                        for (var key22 in FiltersConstants.words[scope.imageFileName][key2].filters) {
                            // console.log(combination.filters[key22]);
                            // console.log(FiltersConstants.words[scope.imageFileName][key2].filters[key22]);
                            if (combination.filters) {
                                tmpDistance += Math.pow((combination.filters[key22] - FiltersConstants.words[scope.imageFileName][key2].filters[key22]), 2)
                            }
                        }
                        distances.push({ distance: Math.round(Math.sqrt(tmpDistance) * 1000)/ 1000, symbol: key2 });
                    }
                    minDistance = distances[0];
                    for (var i = 0; i < distances.length; i++) {
                        if (minDistance.distance > distances[i].distance) {
                            minDistance = distances[i];
                        }
                    }
                    combination.distance = minDistance.distance;
                    combination.symbol = minDistance.symbol;
                    console.log(scope.combinations);
                });

            };

            scope.symbol = () => {
                var fil;
                console.log(scope.originalGrayscaleData);
                fil = Filters.applyMainFilters(scope.originalGrayscaleData, 0, scope.originalGrayscaleData.width);
                console.log(fil);
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
