(function() {
    'use strict';

    angular
        .module('app')
        .factory('GithubRepoModel', GithubRepoModel);

    function GithubRepoModel() {
        function GithubRepo(config) {
            this.id = config.id;
            this.fullName = config.full_name;
            this.name = config.name;
            this.forks = config.forks_count;
            this.watchers = config.watchers_count;
            this.stars = config.stargazers_count;
            this.openIssues = config.open_issues_count;
        }

        return GithubRepo;
    }
})();
