(function() {
    'use strict';

    angular
        .module('app')
        .component('githubApp', {
            templateUrl: 'app/github-app/github-app.component.html',
            controller: GithubApp
        });
    /* @ngInject */
    function GithubApp(githubService) {
        var $ctrl = this;

        $ctrl.issues = [];
        $ctrl.total_issues = null;
        $ctrl.repos = [];
        $ctrl.selectedRepo = null;
        $ctrl.isDisabled = false;
        $ctrl.page = 1;
        $ctrl.sort = 'comments';
        $ctrl.order = 'desc';
        $ctrl.state = '';

        $ctrl.changeRepo = changeRepo;
        $ctrl.filterIssues = filterIssues;
        $ctrl.sortIssues = sortIssues;
        $ctrl.loadMoreIssues = loadMoreIssues;
        $ctrl.$onInit = $onInit;

        function $onInit() {
            githubService.getRepos()
                .then(function(repos) {
                    $ctrl.repos = repos;
                    $ctrl.selectedRepo = $ctrl.repos[0];
                    _getIssues();
                })
        }

        function changeRepo(repo) {
            $ctrl.selectedRepo = repo;
            $ctrl.page = 1;
            $ctrl.issues = [];
            _getIssues();
        }

        function filterIssues(selectedFilter) {
            $ctrl.state = selectedFilter;
            $ctrl.page = 1;
            $ctrl.issues = [];
            _getIssues();
            console.log('Filter the selected repo by', selectedFilter);
        }

        function sortIssues(selectedSort) {
            var currentSort = selectedSort.split(' ');
            $ctrl.sort = currentSort[0];
            $ctrl.order = currentSort[1];
            $ctrl.page = 1;
            $ctrl.issues = [];
            _getIssues();
            console.log('Sort the selected repo by', selectedSort);
        }

        function loadMoreIssues() {
            $ctrl.page++;
            _getIssues();
        }

        function _getIssues() {
            $ctrl.isDisabled = true;

            return githubService.getIssues($ctrl.selectedRepo.fullName, { page: $ctrl.page, state: $ctrl.state, sort: $ctrl.sort, order: $ctrl.order })
                .then(function(response) {
                    $ctrl.issues = $ctrl.issues.concat(response.issues);
                    $ctrl.total_issues = response.totalIssues;
                })
                .finally(function() {
                    $ctrl.isDisabled = false;
                });
        }
    }
})();
