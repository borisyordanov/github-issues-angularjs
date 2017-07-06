(function() {
    'use strict';

    angular
        .module('app')
        .component('githubIssue', {
            templateUrl: 'app/github-issue/github-issue.component.html',
            bindings: {
                issue: '<'
            }
        });
})();
