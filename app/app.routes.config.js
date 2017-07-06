(function() {
    'use strict';
    // Module definition
    angular
        .module('app')
        .config(function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('main', {
                    abstract: true,
                    url: '',
                    template: '<github-header></github-header><ui-view/>'
                })
                .state('home', {
                    url: '/home',
                    template: '<github-app></github-app>',
                    parent: 'main',
                    data: {
                        requiresLogin: true
                    }
                })
                .state('about', {
                    url: '/about',
                    template: '<about></about>',
                    parent: 'main',
                    data: {
                        requiresLogin: true
                    }
                })
                .state('contacts', {
                    url: '/contacts',
                    template: '<contacts></contacts>',
                    parent: 'main',
                    data: {
                        requiresLogin: true
                    }
                })
                .state('login', {
                    url: '/login',
                    template: '<login></login>'
                });

            $urlRouterProvider.otherwise('/home');
        })
        .run(setEvents);

    /* @ngInject */
    function setEvents($state, $transitions, authService) {
        $transitions.onStart({}, function(trans) {
            if (trans.$to().data && trans.$to().data.requiresLogin) {
                if (!authService.isLoggedIn()) {
                    $state.go('login');
                }
            }
        });
    }
})();
