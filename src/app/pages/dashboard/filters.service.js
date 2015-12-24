export default function Filters() {
    'ngInject';

    this.xy = 3;
    this.scale = 1;

    this.setPixels = (elements, img) => {
        var c = elements[1];
        var ctx = c.getContext('2d');
        ctx.putImageData(elements[0], 0, 0);
        return elements[0];
    };

    this.getPixels = (img, parent, inScale) => {
        var scale = inScale;
        var c = this.getCanvas(img.width * scale, img.height * scale, parent);
        c.classList.add("img-responsive");
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, img.clientWidth * scale, img.clientHeight * scale);
        return [ctx.getImageData(0, 0, img.width * scale, img.height * scale), c];
    };

    this.getCanvas = (w, h, parent) => {
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
        var tmpXY = elements[2];
        var half = parseInt(tmpXY / 2);
        var currentY;
        var currentX;
        for (var y = 0; y < elements[0].height; y++) {
            for (var x = 0; x < elements[0].width; x++) {
                for (var i = 0; i < tmpXY; i++) {
                    for (var j = 0; j < tmpXY; j++) {
                        currentY = y + i - half;
                        currentX = x + j - half;

                        //- вершины ------------------------------------------------------------------------------------------------------------
                        if (currentY < 0 && currentX < 0) {
                            tmpArray.push(data[0][0]);
                        }

                        else if (currentY < 0 && currentX > elements[0].width - 1) {
                            tmpArray.push(data[0][elements[0].width - 1]);
                        }

                        else if (currentY > elements[0].height - 1 && currentX > elements[0].width - 1) {
                            tmpArray.push(data[elements[0].height - 1][elements[0].width - 1]);
                        }

                        else if (currentY > elements[0].height - 1 && currentX < 0) {
                            tmpArray.push(data[elements[0].height - 1][0]);
                        }
                        //----------------------------------------------------------------------------------------------------------------------

                        else if (currentY < 0 && currentX >= 0 && currentX <= elements[0].width - 1) {
                            tmpArray.push(data[0][currentX]);
                        }

                        else if (currentY >= 0 && currentY <= elements[0].height - 1 && currentX < 0) {
                            tmpArray.push(data[currentY][0]);
                        }

                        else if (currentY > elements[0].height - 1 && currentX >= 0 && currentX <= elements[0].width - 1) {
                            tmpArray.push(data[elements[0].height - 1][currentX]);
                        }
                        else if (
                            currentY >= 0 && currentY <= elements[0].height - 1 && currentX > elements[0].width - 1) {
                            tmpArray.push(data[currentY][elements[0].width - 1]);
                        }
                        else {
                            tmpArray.push(data[currentY][currentX]);
                        }
                    }
                }
                tmpArray.sort(function compareNumbers(a, b) {
                    return a - b;
                });
                data[y][x] = tmpArray[((tmpXY * tmpXY) / 2 - 0.5)];
                tmpArray = [];

            }
        }
        elements[0].data.set(this.toOldFormatData(elements[0], data));
        data = null;
        return elements;
    };

    this.toStructuredData = (element) => {
        var w = element.width, h = element.height, i = 0, data = element.data;
        var tmpData = new Array(h);

        for (var he = 0; he < h; he++) {
            tmpData[he] = new Array(w);
        }

        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++ , i += 4) {
                tmpData[y][x] = data[i];
            }
        }
        data = null;
        return tmpData;
    };

    this.toOldFormatData = (element, data) => {
        var w = element.width, h = element.height, i = 0;
        var tmpData = new Array(w * h);

        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++ , i += 4) {
                tmpData[i] = tmpData[i + 1] = tmpData[i + 2] = data[y][x];
                tmpData[i + 3] = 255;
            }
        }
        return tmpData;
    };

    this.filterImage = (filter, image, parent, pixels, xy, scale) => {

        var args;
        if (!pixels) {
            args = [this.getPixels(image, parent, scale)];
        } else {
            args = [this.getPixels(image, parent, scale)];
            args[0][0] = pixels;
            args[0][2] = xy;
        }
        return filter.apply(this, args);
    };

    this.filterF1 = (data, width, step) => {
        var structuredData = this.toStructuredData(data);
        var yx = [];
        var firstPart = [];
        var secondPart = [];
        for (var i = 0; i < data.width - width; i += step) {
            for (var y = 0; y < data.height; y++) {
                for (var x = 0; x < width; x++) {
                    if (x < width / 2) {
                        firstPart.push(structuredData[y][x + i]);
                    }
                    if (x >= width / 2) {
                        secondPart.push(structuredData[y][x + i]);
                    }
                }
            }
            yx.push({ x: i, y: secondPart.reduce((a, b) => a + b) - firstPart.reduce((a, b) => a + b) });
            firstPart = [];
            secondPart = [];

        }
        return yx;
    };

    this.applyMainFilters = (data, min, max) => {
        var structuredData = this.toStructuredData(data);
        var filters = {};
        var parts = [];
        var count = 0;
        var segment = max - min;
        var tmpSegment = segment;
        var isNewStep = false;
        var step = segment / 4;
        var tmpStep = step;
        var stepOther;
        if (segment < 4) {
            return;
        }
        for (var f = 0; f < 16; f++) {
            parts[f] = [];
        }

        function checkStep() {
            step = parseInt(step) + 1;
            if ((tmpSegment - step) % 3 !== 0 && (tmpSegment - step) !== 0) {
                checkStep();
            } else {
                stepOther = (tmpSegment - step) / 3;
            }
            tmpStep = step;
        }

        if (segment % 4 !== 0) {
            checkStep();
            isNewStep = true;
        }
        for (var i = 0; i < data.height; i += data.height / 4) {
            for (var j = min; j < max; j += step) {
                if (isNewStep && j !== min) {
                    step = stepOther;
                } else if (isNewStep && j == min) {
                    step = tmpStep;
                }
                for (var y = i; y < i + data.height / 4; y++) {
                    for (var x = j; x < j + step; x++) {
                        if (structuredData[y][x] == undefined) {
                            console.log(undefined);
                        }
                        parts[count].push(structuredData[y][x]);
                    }
                }
                count++;
            }
        }

        filters[0] = (
            parts[0].reduce((a, b) => a + b)
            + parts[1].reduce((a, b) => a + b)
            + parts[2].reduce((a, b) => a + b)
            + parts[3].reduce((a, b) => a + b)
            + parts[4].reduce((a, b) => a + b)
            + parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            + parts[7].reduce((a, b) => a + b)
            + parts[8].reduce((a, b) => a + b)
            + parts[9].reduce((a, b) => a + b)
            + parts[10].reduce((a, b) => a + b)
            + parts[11].reduce((a, b) => a + b)
            + parts[12].reduce((a, b) => a + b)
            + parts[13].reduce((a, b) => a + b)
            + parts[14].reduce((a, b) => a + b)
            + parts[15].reduce((a, b) => a + b)
            );

        filters[1] = (
            parts[2].reduce((a, b) => a + b)
            + parts[3].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            + parts[7].reduce((a, b) => a + b)
            + parts[10].reduce((a, b) => a + b)
            + parts[11].reduce((a, b) => a + b)
            + parts[14].reduce((a, b) => a + b)
            + parts[15].reduce((a, b) => a + b)
            - parts[0].reduce((a, b) => a + b)
            - parts[1].reduce((a, b) => a + b)
            - parts[4].reduce((a, b) => a + b)
            - parts[5].reduce((a, b) => a + b)
            - parts[8].reduce((a, b) => a + b)
            - parts[9].reduce((a, b) => a + b)
            - parts[12].reduce((a, b) => a + b)
            - parts[13].reduce((a, b) => a + b)
            )

        filters[2] = (
            parts[0].reduce((a, b) => a + b)
            + parts[1].reduce((a, b) => a + b)
            + parts[2].reduce((a, b) => a + b)
            + parts[3].reduce((a, b) => a + b)
            + parts[4].reduce((a, b) => a + b)
            + parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            + parts[7].reduce((a, b) => a + b)
            - parts[8].reduce((a, b) => a + b)
            - parts[9].reduce((a, b) => a + b)
            - parts[10].reduce((a, b) => a + b)
            - parts[11].reduce((a, b) => a + b)
            - parts[12].reduce((a, b) => a + b)
            - parts[13].reduce((a, b) => a + b)
            - parts[14].reduce((a, b) => a + b)
            - parts[15].reduce((a, b) => a + b)
            );

        filters[3] = (
            - parts[0].reduce((a, b) => a + b)
            - parts[1].reduce((a, b) => a + b)
            + parts[2].reduce((a, b) => a + b)
            + parts[3].reduce((a, b) => a + b)
            - parts[4].reduce((a, b) => a + b)
            - parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            + parts[7].reduce((a, b) => a + b)
            + parts[8].reduce((a, b) => a + b)
            + parts[9].reduce((a, b) => a + b)
            - parts[10].reduce((a, b) => a + b)
            - parts[11].reduce((a, b) => a + b)
            + parts[12].reduce((a, b) => a + b)
            + parts[13].reduce((a, b) => a + b)
            - parts[14].reduce((a, b) => a + b)
            - parts[15].reduce((a, b) => a + b)
            );

        filters[4] = (
            - parts[0].reduce((a, b) => a + b)
            + parts[1].reduce((a, b) => a + b)
            + parts[2].reduce((a, b) => a + b)
            - parts[3].reduce((a, b) => a + b)
            - parts[4].reduce((a, b) => a + b)
            + parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            - parts[7].reduce((a, b) => a + b)
            - parts[8].reduce((a, b) => a + b)
            + parts[9].reduce((a, b) => a + b)
            + parts[10].reduce((a, b) => a + b)
            - parts[11].reduce((a, b) => a + b)
            - parts[12].reduce((a, b) => a + b)
            + parts[13].reduce((a, b) => a + b)
            + parts[14].reduce((a, b) => a + b)
            - parts[15].reduce((a, b) => a + b)
            );

        filters[5] = (
            - parts[0].reduce((a, b) => a + b)
            - parts[1].reduce((a, b) => a + b)
            - parts[2].reduce((a, b) => a + b)
            - parts[3].reduce((a, b) => a + b)
            + parts[4].reduce((a, b) => a + b)
            + parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            + parts[7].reduce((a, b) => a + b)
            + parts[8].reduce((a, b) => a + b)
            + parts[9].reduce((a, b) => a + b)
            + parts[10].reduce((a, b) => a + b)
            + parts[11].reduce((a, b) => a + b)
            - parts[12].reduce((a, b) => a + b)
            - parts[13].reduce((a, b) => a + b)
            - parts[14].reduce((a, b) => a + b)
            - parts[15].reduce((a, b) => a + b)
            );
            
        filters[6] = (
            - parts[0].reduce((a, b) => a + b)
            + parts[1].reduce((a, b) => a + b)
            + parts[2].reduce((a, b) => a + b)
            - parts[3].reduce((a, b) => a + b)
            - parts[4].reduce((a, b) => a + b)
            + parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            - parts[7].reduce((a, b) => a + b)
            + parts[8].reduce((a, b) => a + b)
            - parts[9].reduce((a, b) => a + b)
            - parts[10].reduce((a, b) => a + b)
            + parts[11].reduce((a, b) => a + b)
            + parts[12].reduce((a, b) => a + b)
            - parts[13].reduce((a, b) => a + b)
            - parts[14].reduce((a, b) => a + b)
            + parts[15].reduce((a, b) => a + b)
            );
            
        filters[7] = (
            + parts[0].reduce((a, b) => a + b)
            + parts[1].reduce((a, b) => a + b)
            - parts[2].reduce((a, b) => a + b)
            - parts[3].reduce((a, b) => a + b)
            - parts[4].reduce((a, b) => a + b)
            - parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            + parts[7].reduce((a, b) => a + b)
            - parts[8].reduce((a, b) => a + b)
            - parts[9].reduce((a, b) => a + b)
            + parts[10].reduce((a, b) => a + b)
            + parts[11].reduce((a, b) => a + b)
            + parts[12].reduce((a, b) => a + b)
            + parts[13].reduce((a, b) => a + b)
            - parts[14].reduce((a, b) => a + b)
            - parts[15].reduce((a, b) => a + b)
            );
            
        filters[8] = (
            + parts[0].reduce((a, b) => a + b)
            - parts[1].reduce((a, b) => a + b)
            - parts[2].reduce((a, b) => a + b)
            + parts[3].reduce((a, b) => a + b)
            - parts[4].reduce((a, b) => a + b)
            + parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            - parts[7].reduce((a, b) => a + b)
            - parts[8].reduce((a, b) => a + b)
            + parts[9].reduce((a, b) => a + b)
            + parts[10].reduce((a, b) => a + b)
            - parts[11].reduce((a, b) => a + b)
            + parts[12].reduce((a, b) => a + b)
            - parts[13].reduce((a, b) => a + b)
            - parts[14].reduce((a, b) => a + b)
            + parts[15].reduce((a, b) => a + b)
            );
            
        filters[9] = (
            + parts[0].reduce((a, b) => a + b)
            - parts[1].reduce((a, b) => a + b)
            + parts[2].reduce((a, b) => a + b)
            - parts[3].reduce((a, b) => a + b)
            + parts[4].reduce((a, b) => a + b)
            - parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            - parts[7].reduce((a, b) => a + b)
            + parts[8].reduce((a, b) => a + b)
            - parts[9].reduce((a, b) => a + b)
            + parts[10].reduce((a, b) => a + b)
            - parts[11].reduce((a, b) => a + b)
            + parts[12].reduce((a, b) => a + b)
            - parts[13].reduce((a, b) => a + b)
            + parts[14].reduce((a, b) => a + b)
            - parts[15].reduce((a, b) => a + b)
            );
        filters[10] = (
            - parts[0].reduce((a, b) => a + b)
            - parts[1].reduce((a, b) => a + b)
            - parts[2].reduce((a, b) => a + b)
            - parts[3].reduce((a, b) => a + b)
            + parts[4].reduce((a, b) => a + b)
            + parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            + parts[7].reduce((a, b) => a + b)
            - parts[8].reduce((a, b) => a + b)
            - parts[9].reduce((a, b) => a + b)
            - parts[10].reduce((a, b) => a + b)
            - parts[11].reduce((a, b) => a + b)
            + parts[12].reduce((a, b) => a + b)
            + parts[13].reduce((a, b) => a + b)
            + parts[14].reduce((a, b) => a + b)
            + parts[15].reduce((a, b) => a + b)
            );
        filters[11] = (
            + parts[0].reduce((a, b) => a + b)
            - parts[1].reduce((a, b) => a + b)
            + parts[2].reduce((a, b) => a + b)
            - parts[3].reduce((a, b) => a + b)
            + parts[4].reduce((a, b) => a + b)
            - parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            - parts[7].reduce((a, b) => a + b)
            - parts[8].reduce((a, b) => a + b)
            + parts[9].reduce((a, b) => a + b)
            - parts[10].reduce((a, b) => a + b)
            + parts[11].reduce((a, b) => a + b)
            - parts[12].reduce((a, b) => a + b)
            + parts[13].reduce((a, b) => a + b)
            - parts[14].reduce((a, b) => a + b)
            + parts[15].reduce((a, b) => a + b)
            );
        filters[12] = (
            + parts[0].reduce((a, b) => a + b)
            + parts[1].reduce((a, b) => a + b)
            - parts[2].reduce((a, b) => a + b)
            - parts[3].reduce((a, b) => a + b)
            - parts[4].reduce((a, b) => a + b)
            - parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            + parts[7].reduce((a, b) => a + b)
            + parts[8].reduce((a, b) => a + b)
            + parts[9].reduce((a, b) => a + b)
            - parts[10].reduce((a, b) => a + b)
            - parts[11].reduce((a, b) => a + b)
            - parts[12].reduce((a, b) => a + b)
            - parts[13].reduce((a, b) => a + b)
            + parts[14].reduce((a, b) => a + b)
            + parts[15].reduce((a, b) => a + b)
            );
        filters[13] = (
            - parts[0].reduce((a, b) => a + b)
            + parts[1].reduce((a, b) => a + b)
            - parts[2].reduce((a, b) => a + b)
            + parts[3].reduce((a, b) => a + b)
            + parts[4].reduce((a, b) => a + b)
            - parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            - parts[7].reduce((a, b) => a + b)
            + parts[8].reduce((a, b) => a + b)
            - parts[9].reduce((a, b) => a + b)
            + parts[10].reduce((a, b) => a + b)
            - parts[11].reduce((a, b) => a + b)
            - parts[12].reduce((a, b) => a + b)
            + parts[13].reduce((a, b) => a + b)
            - parts[14].reduce((a, b) => a + b)
            + parts[15].reduce((a, b) => a + b)
            );
        filters[14] = (
            + parts[0].reduce((a, b) => a + b)
            - parts[1].reduce((a, b) => a + b)
            - parts[2].reduce((a, b) => a + b)
            + parts[3].reduce((a, b) => a + b)
            - parts[4].reduce((a, b) => a + b)
            + parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            - parts[7].reduce((a, b) => a + b)
            + parts[8].reduce((a, b) => a + b)
            - parts[9].reduce((a, b) => a + b)
            - parts[10].reduce((a, b) => a + b)
            + parts[11].reduce((a, b) => a + b)
            - parts[12].reduce((a, b) => a + b)
            + parts[13].reduce((a, b) => a + b)
            + parts[14].reduce((a, b) => a + b)
            - parts[15].reduce((a, b) => a + b)
            );
        filters[15] = (
            - parts[0].reduce((a, b) => a + b)
            + parts[1].reduce((a, b) => a + b)
            - parts[2].reduce((a, b) => a + b)
            + parts[3].reduce((a, b) => a + b)
            + parts[4].reduce((a, b) => a + b)
            - parts[5].reduce((a, b) => a + b)
            + parts[6].reduce((a, b) => a + b)
            - parts[7].reduce((a, b) => a + b)
            - parts[8].reduce((a, b) => a + b)
            + parts[9].reduce((a, b) => a + b)
            - parts[10].reduce((a, b) => a + b)
            + parts[11].reduce((a, b) => a + b)
            + parts[12].reduce((a, b) => a + b)
            - parts[13].reduce((a, b) => a + b)
            + parts[14].reduce((a, b) => a + b)
            - parts[15].reduce((a, b) => a + b)
            );

        console.log(filters);
    };

    this.findExtremums = (data) => {
        var allExtremums = [];
        var extremums = { min: [], max: [] };
        for (var i = 0; i < data.length; i++) {
            if (data[i - 1] && data[i + 1]) {
                if (data[i - 1].y > data[i].y && data[i + 1].y > data[i].y) {
                    allExtremums.push(data[i]);
                    extremums.min.push(data[i]);
                }
                if (data[i - 1].y < data[i].y && data[i + 1].y < data[i].y) {
                    allExtremums.push(data[i]);
                    extremums.max.push(data[i]);
                }
            }
        }
        return { allExtremums: allExtremums, extremums: extremums }
    }

};
