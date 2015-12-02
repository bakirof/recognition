export default function Filters() {
  'ngInject';

  this.x = 3;
  this.y = 3;

  this.setPixels = function (elements, img) {
    var c = elements[1];
    var ctx = c.getContext('2d');
    ctx.putImageData(elements[0], 0, 0);
    return elements[0];
  };

  this.getPixels = function (img, parent) {
    var c = this.getCanvas(img.width, img.height, parent);
    c.classList.add("img-responsive");
    var ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, img.clientWidth, img.clientHeight);
    return [ctx.getImageData(0, 0, img.width, img.height), c];
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

  this.median = (elements) => {
    elements[1].classList.add('median-img-canvas');
    var tmpArray = [];
    var data = this.toStructuredData(elements[0]);
    var half = parseInt(this.x / 2);
    var tmpX = this.x;
    var tmpY = this.y;
    var tmpI = 0;
    var tmpJ = 0;
    var t = 0;
    var checkY = ()=> {
      if (y - i + half > elements[0].height - 1) {
        t++;
        i = y + half - (elements[0].height - 1);
      }
      if (y - i + half < 0) {
        t++;
        i = y + half;
      }
      if (!data[y - i + half]) {
        checkY();
      }
    };
    var checkX = ()=> {
      if (x - j + half > elements[0].width - 1) {
        t++;
        j = x + half - (elements[0].width - 1);
      }
      if (x - j + half < 0) {
        t++;
        j = x + half;
      }
    };
    for (var y = 0; y < elements[0].height; y++) {
      for (var x = 0; x < elements[0].width; x++) {
        for (var i = 0; i < tmpY; i++) {
          tmpI = i;
          checkY();
          for (var j = 0; j < tmpX; j++) {
            tmpJ = j;
            checkX();
            if (data[y - i + half] && data[y - i + half][x - j + half]) {
              tmpArray.push(data[y - i + half][x - j + half]);
            }
            if (t) {
              i = tmpI;
              j = tmpJ;
            }
            t = 0;
          }
        }
        tmpArray.sort(function compareNumbers(a, b) {
          return a - b;
        });

        data[y][x] = tmpArray[((tmpY * tmpX) / 2 + 0.5)];
        tmpArray = [];

      }
    }
    elements[0].data.set(this.toOldFormatData(elements[0], data));
    return elements;
  };


  this.toStructuredData = function (element) {
    var w = element.width, h = element.height, i = 0, data = element.data;
    var tmpData = new Array(h);

    for (var he = 0; he < h; he++) {
      tmpData[he] = new Array(w);
    }

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++, i += 4) {
        tmpData[y][x] = data[i];
      }
    }
    console.log(tmpData);
    return tmpData;
  };

  this.toOldFormatData = function (element, data) {
    var w = element.width, h = element.height, i = 0;
    var tmpData = new Array(w * h);

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++, i += 4) {
        tmpData[i] = tmpData[i + 1] = tmpData[i + 2] = data[y][x];
        tmpData[i + 3] = 255;
      }
    }
    console.log(tmpData);
    return tmpData;
  };

  this.filterImage = function (filter, image, parent, pixels) {
    var args;
    if (!pixels) {
      args = [this.getPixels(image, parent)];
    } else {
      args = [this.getPixels(image, parent)];
      args[0][0] = pixels;
    }
    return filter.apply(null, args);
  };
};
