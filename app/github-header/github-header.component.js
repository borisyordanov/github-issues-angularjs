(function() {
    'use strict';
    angular.module('app').component('githubHeader', {
        templateUrl: 'app/github-header/github-header.component.html',
        controller: Header
    });

    function Header(authService) {
        this.logout = logout;
        function logout() {
            authService.logout();
        }
    }
})();
