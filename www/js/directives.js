angular.module('app.directives', [])

.directive('blankDirective', [function(){

}])

.directive('qrcode', function($interpolate) {  
  return {
    restrict: 'E',
    link: function($scope, $element, $attrs) {

      var options = {
        text: '',
        width: 180,
        height: 180,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: 'H'
      };

      Object.keys(options).forEach(function(key) {
        options[key] = $interpolate($attrs[key] || '')($scope) || options[key];
      });

      options.correctLevel = QRCode.CorrectLevel[options.correctLevel];

      new QRCode($element[0], options);

    }
  };
});