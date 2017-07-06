(function() {
    'use strict';

    angular
        .module('app')
        .component('githubRepoStats', {
            templateUrl: 'app/github-repo-stats/github-repo-stats.component.html',
            bindings: {
                repo: '<',
                totalIssues: '<'
            },
            controller: GithubRepoStats
        });

    function GithubRepoStats() {
    }
})();
