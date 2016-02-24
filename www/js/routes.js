angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('logIn', {
            url: '/log',
            templateUrl: 'templates/logIn.html',
            controller: 'logInCtrl'
        })




        .state('tinklItPOS', {
            url: '/pos',
            templateUrl: 'templates/tinklItPOS.html',
            controller: 'tinklItPOSCtrl'
        })




        .state('paywall', {
            url: '/pay',
            templateUrl: 'templates/paywall.html',
            controller: 'paywallCtrl'
        })

        
    .state('invoices', {
      url: '/invoices',
      templateUrl: 'templates/invoices.html',
      controller: 'invoicesCtrl'
    })

        ;
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/pos');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
});