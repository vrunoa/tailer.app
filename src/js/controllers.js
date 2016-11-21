var controllers = angular.module('tailerControllers', [])
controllers.controller('EditorController', ['$scope', function ($scope) {
  $scope.workshops = w.getWorkshops()
  $scope.exercises = []
  $scope.selected_workshop = 0
  $scope.selected_exercise = 0
  $scope.selectWorkshop = _ => {
    $scope.exercises = []
    if ($scope.selected_workshop === 0) {
      return
    }
    $scope.exercises = w.getExercises($scope.workshops[$scope.selected_workshop])
  }
  $scope.selectExercise = _ => {
    let exercise = $scope.exercises[$scope.selected_exercise]
    let data = w.getExercise(exercise)
    editor.setModel(monaco.editor.createModel(data, 'javascript'))
    let desc = w.getExerciseInfo(exercise)
    document.getElementById('exercise_readme').innerHTML = marked(desc)
  }
}])
