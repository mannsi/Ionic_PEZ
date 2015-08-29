// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('PEZ', {
    url: '/PEZ',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'PezCtrl'
  })

    .state('PEZ.Customers', {
      url: '/Customers',
      views: {
        'menuContent': {
          templateUrl: 'templates/Customers.html',
          controller: 'CustomersCtrl'
        }
      }
    })

    .state('PEZ.CustomerAdd', {
      url: '/Customer/Add',
      views: {
        'menuContent': {
          templateUrl: 'templates/CustomerAdd.html',
          controller: 'CustomerAddCtrl'
        }
      }
    })

    .state('PEZ.CustomerList', {
      url: 'Customer/List/:customerId',
      views: {
        'menuContent': {
          templateUrl: 'templates/CustomerList.html',
          controller: 'CustomerListCtrl'
        }
      }
    })

    .state('PEZ.Treatment', {
      url: '/Customer/Treatment/:customerId',
      views: {
        'menuContent': {
          templateUrl: 'templates/CustomerTreatment.html',
          controller: 'CustomerTreatmentCtrl'
        }
      }
    })

  .state('PEZ.single', {
    url: '/Customer/:customerId',
    views: {
      'menuContent': {
        templateUrl: 'templates/CustomerDetails.html',
        controller: 'CustomerDetailsCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/PEZ/Customers');
});
