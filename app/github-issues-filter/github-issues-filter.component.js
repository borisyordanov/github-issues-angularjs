(function() {
    'use strict';

    angular
        .module('app')
        .component('githubIssuesFilter', {
            templateUrl: 'app/github-issues-filter/github-issues-filter.component.html',
            bindings: {
                onFilterBy: '&'
            },
            controller: GithubIssuesFilter
        });

    function GithubIssuesFilter() {
        this.filterBy = 'open';
        this.onFilterChange = onFilterChange;

        function onFilterChange() {
            this.onFilterBy({ selectedFilter: this.filterBy });
        }
    }
})();
