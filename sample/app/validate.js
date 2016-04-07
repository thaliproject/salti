var myApp = angular.module('myApp', []);

myApp.controller('ValidateController', ['$scope', '$http', function ($scope, $http) {
  $scope.greeting = 'Welcome to SALTI!';
  $scope.errors = 'no errors';
  $scope.messages = 'no messages';
  $scope.secret = 'foobar';
  $scope.newdoc = genDoc();

  $scope.createDoc = function () {
    
    var body = { 'secret': 'CLEAR ' + $scope.secret, 'doc' : $scope.newdoc};
    
    $http({
      method: 'POST',
      url: '/validate',
      data: body
    }).then(function successCallback(response) {
      $scope.newdoc = genDoc();
      if (response.data.secret)
        $scope.secret = response.data.secret;
      else
        $scope.messages = JSON.stringify(response);
    }, function errorCallback(response) {
      $scope.errors = JSON.stringify(response);
    });
  }

}]);

  
function genDoc(){
  return JSON.stringify({ _id: guid(), "type": "foobar" })
}

