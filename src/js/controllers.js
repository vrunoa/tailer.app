var controllers = angular.module('tailerControllers', [])
controllers.controller('EditorController', ['$scope', function ($scope) {
  $scope.list = w.getWorkshops()
  $scope.selected_workshop = false
  $scope.selectWorkshop = (name) => {
    console.log($scope.selected_workshop)
  }
}])
