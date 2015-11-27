export default function inputFile($rootScope) {
  return {
    restrict: 'E',
    templateUrl: 'app/components/input-file/input-file.html',
    link: (scope)=> {

      var dropZone = angular.element('#drop-zone');
      scope.startLoading = false;
      scope.fileName = 'Поместить файл';

      function handleFileSelect(evt) {

        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files;
        var reader = new FileReader();
        angular.element('.main-image').remove();
        var img = new Image();
        img.classList.add("img-responsive");
        img.classList.add("main-image");
        img.file = files[0];
        dropZone.appendChild(img);
        reader.onload = (function (aImg) {
          return function (e) {
            var tmp = e.target.result;
            aImg.src = tmp;
            scope.mainImage = aImg;
            $rootScope.$emit('inputFile');
            scope.$apply();
          };
        })(img);

        delete scope.fileName;

        reader.readAsDataURL(files[0]);

      }

      function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
      }


      // Setup the dnd listeners.
      var dropZone = document.getElementById('drop-zone');
      dropZone.addEventListener('dragover', handleDragOver, false);
      dropZone.addEventListener('drop', handleFileSelect, false);
    }
  };

}
