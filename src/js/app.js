var tailer = angular.module('tailerApp', [
  'ngRoute',
  'tailerControllers'
])
tailer.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/editor', {
    templateUrl: 'views/editor.html',
    controller: 'EditorController'
  })
  .when('/downloader', {
    templateUrl: 'views/downloader.html',
    controller: 'DownloaderController'
  })
  .when('/settings', {
    templateUrl: 'views/settings.html',
    controller: 'SettingsController'
  })
  .otherwise({
    redirectTo: '/editor'
  })
}])
