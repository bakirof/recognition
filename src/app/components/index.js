import inputFileDirective from './input-file/input-file.directive';
import grayscaleImageDirective from './grayscale-image/grayscale-image.directive';
import medianImageDirective from './median-image/median.directive';
import filterF1Directive from './filter-f1/filter-f1.directive';
import graphDirective from './graph/graph.directive';
import arrowsCanvasDirective from './arrows-canvas/arrows-canvas.directive';
import tableRowDirective from './table-row/table-row.directive';
export default angular.module('bakirov.components', [])
  .directive('evInputFile', inputFileDirective)
  .directive('evGrayscaleImage', grayscaleImageDirective)
  .directive('evMedianImage', medianImageDirective)
  .directive('evGraph', graphDirective)
  .directive('evFilterF1', filterF1Directive)
  .directive('evArrowsCanvas', arrowsCanvasDirective)
  .directive('evTableRow', tableRowDirective);
