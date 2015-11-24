export default function inputFile() {
  return {
    restrict: 'E',
    templateUrl: 'app/components/grayscale-image/grayscale-image.html',
    link: (scope)=> {
      var Filters = {};
      var grayscaleImage = angular.element('#grayscale-image');

      scope.$watch('mainImage', (image)=> {
        if (image) {
          angular.element(image).load(function () {
            angular.element('.grayscale-img-canvas').remove();
            Filters.setPixels(Filters.filterImage(Filters.grayscale, image), image);
          });
        }
      });

      Filters.setPixels = function (data, img) {
        var c = document.getElementsByTagName('canvas')[0];
        var ctx = c.getContext('2d');
        ctx.putImageData(data, 0, 0);
      };

      Filters.getPixels = function (img) {
        var c = this.getCanvas(img.width * 10, img.height * 10);
        var ctx = c.getContext('2d');
        c.classList.add("img-responsive");
        c.classList.add("grayscale-img-canvas");
        ctx.drawImage(img, 0, 0, img.clientWidth * 10, img.clientHeight * 10);
        return ctx.getImageData(0, 0, img.width * 10, img.height * 10);
      };

      Filters.getCanvas = function (w, h) {
        var c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        grayscaleImage.append(c);
        return c;
      };

      Filters.grayscale = function (pixels, args) {
        var d = pixels.data;
        for (var i = 0; i < d.length; i += 4) {
          var r = d[i];
          var g = d[i + 1];
          var b = d[i + 2];
          var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          d[i] = d[i + 1] = d[i + 2] = v
        }
        return pixels;
      };

      Filters.filterImage = function (filter, image, var_args) {
        var args = [this.getPixels(image)];
        for (var i = 2; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        return filter.apply(null, args);
      };


    }
  };

}
