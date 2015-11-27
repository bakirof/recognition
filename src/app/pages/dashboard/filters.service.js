export default function Filters() {
  'ngInject';

  this.setPixels = function (elements, img) {
    var c = elements[1];
    var ctx = c.getContext('2d');
    ctx.putImageData(elements[0], 0, 0);
    return elements[0];
  };

  this.getPixels = function (img, parent) {
    var c = this.getCanvas(img.width * 10, img.height * 10, parent);
    c.classList.add("img-responsive");
    var ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, img.clientWidth * 10, img.clientHeight * 10);
    return [ctx.getImageData(0, 0, img.width * 10, img.height * 10), c];
  };

  this.getCanvas = function (w, h, parent) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    parent.append(c);
    return c;
  };

  this.grayscale = (elements) => {
    var d = elements[0].data;
    var canvas = angular.element('canvas');
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      var v = 0.33 * r + 0.56 * g + 0.11 * b;
      d[i] = d[i + 1] = d[i + 2] = v
    }
    elements[1].classList.add("grayscale-img-canvas");
    return elements;
  };

  this.median = function (elements) {
    elements[1].classList.add('median-img-canvas');
    return elements;
  };

  this.filterImage = function (filter, image, parent, pixels) {
    var args;
    if (!pixels){
      args = [this.getPixels(image, parent)];
    } else{
      args = [this.getPixels(image, parent)];
      args[0][0] = pixels;
      console.log(pixels);
      console.log(args[0][0]);
    }
    return filter.apply(null, args);
  };
};
