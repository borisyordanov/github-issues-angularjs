(function() {
    'use strict';
    angular.module('app').component('login', {
        templateUrl: 'app/login/login.component.html',
        controller: Login
    });
    /* @ngInject */
    function Login(authService) {
        this.username = null;
        this.password = null;
        this.login = login;

        function login() {
            let userData = {
                username: this.username,
                password: this.password
            };
            authService.login(userData);
        }
    }
})();
