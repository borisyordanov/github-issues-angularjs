(function() {
    'use strict';

    angular
        .module('app')
        .component('githubIssuesSort', {
            templateUrl: 'app/github-issues-sort/github-issues-sort.component.html',
            bindings: {
                onSortBy: '&'
            },
            controller: GithubIssuesSort
        });

    function GithubIssuesSort() {
        this.sortBy = 'comments desc';
        this.onSortChange = onSortChange;

        function onSortChange() {
            this.onSortBy({ selectedSort: this.sortBy });
        }
    }
})();
