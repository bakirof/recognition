
export default class GraphController {
    constructor($scope) {
        'ngInject';
        $scope.options = {
            chart: {
                type: 'lineWithFocusChart',
                height: 580,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 55
                },
                x: function (d) {
                    return d.x;
                },
                y: function (d) {
                    return d.y;
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format(',.4f')(d);
                },
                transitionDuration: 500,
                xAxis: {
                    axisLabel: 'X'
                },
                yAxis: {
                    axisLabel: 'Y',
                    axisLabelDistance: 30
                }
            }
        }
    }
}
