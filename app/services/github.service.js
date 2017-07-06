(function() {
    'use strict';

    angular
        .module('app')
        .service('githubService', githubService);
    /* @ngInject */
    function githubService($http, GithubRepoModel, GithubIssueModel) {
        var client_id = '4baf5db08718ca02f3d8';
        var client_secret = '9b6cae2642a5a9887a22e2cbdc8db141458773e8';
        var baseUrl = 'https://api.github.com/search/';

        this.getIssues = getIssues;
        this.getRepos = getRepos;

        // /issues?page=1&per_page=25&q=+repo:+type:issues+state:open&sort=&order=&client_id=4baf5db08718ca02f3d8&client_secret=9b6cae2642a5a9887a22e2cbdc8db141458773e8
        function getIssues(repoName, params) {
            var q = 'repo:' + repoName + ' ' + 'is:' + params.state;
            return $http.get(baseUrl + 'issues', {
                    params: {
                        client_id: client_id,
                        client_secret: client_secret,
                        page: params.page || 1,
                        per_page: 25,
                        sort: params.sort,
                        order: params.order,
                        q: q
                    }
                })
                .then(function(result) {
                    var issues = result.data.items.map(function(issue) {
                        return new GithubIssueModel(issue);
                    });
                    return {issues: issues, totalIssues: result.data.total_count};
                });
        }

        // /repositories?page=1&per_page=25&q=+repo:+type:issues+state:open&sort=&order=&client_id=4baf5db08718ca02f3d8&client_secret=9b6cae2642a5a9887a22e2cbdc8db141458773e8
        function getRepos() {
            return $http.get(baseUrl + 'repositories', {
                    params: {
                        client_id: client_id,
                        client_secret: client_secret,
                        sort: 'stars',
                        order: 'desc',
                        q: 'language:javascript'
                    }
                })
                .then(function(result) {
                    var topFiveRepos = result.data.items.slice(0, 5).map(function(repo) {
                        return new GithubRepoModel(repo);
                    });
                    return topFiveRepos;
                });
        }
    }
})();
