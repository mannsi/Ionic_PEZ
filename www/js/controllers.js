angular.module('starter.controllers', [])

    .controller('PezCtrl', function($scope, $ionicModal, $timeout) {

      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});
    })

    .controller('CustomerListCtrl', function($scope, dataService) {
        $scope.customers = dataService.GetCustomerList();
    })

    .controller('CustomerCtrl', function($scope, $stateParams, $ionicHistory, Camera, dataService) {
        if ($stateParams.customerId) {
            var customerId = $stateParams.customerId;
            var customerObject = dataService.GetCustomer(customerId);
            $scope.customer = customerObject;
        }
        else{
            $scope.customer = dataService.GetDefaultCustomer();
        }
        $scope.imageURI = $scope.customer.imageURI;

        $scope.getPhoto = function() {
            Camera.getPicture().then(function(imageURI) {
                $scope.imageURI = imageURI;
            }, function(err) {
                console.err(err);
            });
        }

        $scope.saveCustomer = function(customer) {
            if (customer) {
                customer.imageURI = $scope.imageURI;
                dataService.SaveCustomer(customer);
            }

            $ionicHistory.goBack();
        };

        $scope.adstandandi = {show:false};
        $scope.sjukdomar = {show:false};
        $scope.puls = {show:false};
        $scope.annad = {show:false};

        $scope.toggleGroup = function(group) {
            group.show = !group.show;
        };
        $scope.isGroupShown = function(group) {
            return group.show;
        };
    })

    .controller('TreatmentListCtrl', function($scope , $stateParams, dataService) {
        var customerId = $stateParams.customerId;
        $scope.customer = dataService.GetCustomer(customerId);
        $scope.treatments = dataService.GetTreatmentList(customerId);
    })

    .controller('TreatmentCtrl', function($scope , $stateParams, dataService) {
        var customerId = $stateParams.customerId;
        var treatmentId = $stateParams.treatmentId;
        $scope.customer = dataService.GetCustomer(customerId);
        $scope.treatment = dataService.GetTreatment(customerId, treatmentId);
    })

    .controller('TreatmentAddCtrl', function($scope , $stateParams) {
        $scope.treatment = {id: $stateParams.treatmentId};
    });



