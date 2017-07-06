(function() {
    'use strict';

    angular
        .module('app')
        .component('githubIssuesToolbar', {
            templateUrl: 'app/github-issues-toolbar/github-issues-toolbar.component.html',
            bindings: {
                onFilter: '&',
                onSort: '&'
            },
            controller: GithubIssuesToolbar
        });

    function GithubIssuesToolbar() {
        this.onFilterBy = onFilterBy;
        this.onSortBy = onSortBy;

        function onFilterBy(selectedFilter) {
            this.onFilter({ selectedFilter: selectedFilter });
        }

        function onSortBy(selectedSort) {
            this.onSort({ selectedSort: selectedSort });
        }
    }
})();
