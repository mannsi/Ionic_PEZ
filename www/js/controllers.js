angular.module('starter.controllers', [])

.controller('PezCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

    // Create and load the Modal
    $ionicModal.fromTemplateUrl('PEZ/AddCustomer', function(modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });


    $scope.AddCustomer = function() {
      //$scope.taskModal.show();
      alert("working")
    };

})

.controller('CustomersCtrl', function($scope) {
  $scope.customers = [
    { title: 'Einar B. Sigurbergsson', id: 1 },
    { title: 'Ari Arason', id: 2 },
    { title: 'Sigga Ragga', id: 3 },
    { title: 'Hamstur Þorsteinsson', id: 4 }
  ];
})

.controller('CustomerDetailsCtrl', function($scope, $state , $stateParams) {
    $scope.customerId = $stateParams.customerId
    console.log($stateParams)
})

.controller('CustomerAddCtrl', function($scope) {
})

.controller('CustomerListCtrl', function($scope, $state , $stateParams) {
    $scope.customerId = $stateParams.customerId
    console.log($stateParams)
})

.controller('CustomerTreatmentCtrl', function($scope, $state , $stateParams) {
    $scope.customerId = $stateParams.customerId
    console.log($stateParams)
  })



