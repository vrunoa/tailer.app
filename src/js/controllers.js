var controllers = angular.module('tailerControllers', [])
controllers.controller('EditorController', ['$scope', function ($scope) {
  $scope.list = w.getWorkshops()
}])
