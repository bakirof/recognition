import inputFileDirective from './input-file/input-file.directive';
import grayscaleImageDirective from './grayscale-image/grayscale-image.directive';

export default angular.module('bakirov.components', [])
.directive('evInputFile', inputFileDirective)
.directive('evGrayscaleImage', grayscaleImageDirective);
