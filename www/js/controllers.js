angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

    // Create and load the Modal
    $ionicModal.fromTemplateUrl('app/AddCustomer', function(modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });


    $scope.AddCustomer = function() {
      $scope.taskModal.show();
      //alert("working")
    };

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Einar B. Sigurbergsson', id: 1 },
    { title: 'Ari Arason', id: 2 },
    { title: 'Sigga Ragga', id: 3 },
    { title: 'Hamstur Þorsteinsson', id: 4 }
  ];


})

.controller('AddCustomerCtrl', function($scope) {
});
