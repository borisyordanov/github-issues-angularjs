(function() {
    'use strict';
    angular.module('app').service('authService', authService);
    /* @ngInject */
    function authService($state) {
        this.login = login;
        this.logout = logout;
        this.isLoggedIn = isLoggedIn;

        function login(user) {
            localStorage.setItem('loginData', JSON.stringify(user));
            $state.go('home');
        }

        function logout() {
            localStorage.setItem('loginData', null);
            $state.go('login');
        }

        function isLoggedIn() {
            // Retrieve the object from storage
            return !!JSON.parse(localStorage.getItem('loginData'));
        }
    }
})();
