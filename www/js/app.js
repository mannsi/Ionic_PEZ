// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

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
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/Customers.html',
          controller: 'CustomerListCtrl'
        }
      }
    })


    .state('PEZ.CustomerEdit', {
      url: '/Customer/Edit/:customerId',
      views: {
        'menuContent': {
          templateUrl: 'templates/CustomerDetails.html',
          controller: 'CustomerCtrl'
        }
      }
    })

    .state('PEZ.CustomerAdd', {
      url: '/Customer/Add',
      views: {
        'menuContent': {
          templateUrl: 'templates/CustomerDetails.html',
          controller: 'CustomerCtrl'
        }
      }
    })

    .state('PEZ.TreatmentList', {
      url: '/TreatmentList/:customerId',
      views: {
        'menuContent': {
          templateUrl: 'templates/TreatmentList.html',
          controller: 'TreatmentListCtrl'
        }
      }
    })

    .state('PEZ.Treatment', {
      url: '/Treatment/:treatmentId/:customerId',
      views: {
        'menuContent': {
          templateUrl: 'templates/Treatment.html',
          controller: 'TreatmentCtrl'
        }
      }
    })

    .state('PEZ.TreatmentAdd', {
      url: '/Treatment/Add/:customerId',
      views: {
        'menuContent': {
          templateUrl: 'templates/Treatment.html',
          controller: 'TreatmentAddCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/PEZ/Customers');
});
