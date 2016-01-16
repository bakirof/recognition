export default function arrowsCanves($rootScope) {
    'ngInject';
    return {
        restrict: 'A',
        link: (scope, el) => {
            $rootScope.$on('grayscaled', () => {
                console.log(el);
                var position = el.children().position();
                var canvas = el.children().clone();
                el.prepend(canvas);
                canvas.removeClass('img-responsive');
                canvas.removeClass('grayscale-img-canvas');
                canvas.addClass('arrows-canvas');
                canvas.css('top', position.top);
                canvas.css('left', position.left);
                
                var ctx = canvas[0].getContext('2d');
                ctx.strokeStyle = '#004AFF';
                scope.updateArrows = (min, max) => {
                    ctx.beginPath();
                    ctx.moveTo(min, 0);
                    ctx.lineTo(min, 110);
                    ctx.moveTo(max, 0);
                    ctx.lineTo(max, 110);
                    ctx.stroke();
                }
                scope.clearCanvas = ()=>{
                    ctx.beginPath()
                    ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
                }
            });
        }
    }
}