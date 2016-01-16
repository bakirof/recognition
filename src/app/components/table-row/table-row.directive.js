export default function tableRowDirective(){
    return {
        restrict: "A",
        link : (scope, el)=>{
            el.mouseenter(()=>{
                scope.updateArrows(scope.min, scope.max);
            });
            el.mouseleave(()=>{
                scope.clearCanvas();
            });
        }
    }
}