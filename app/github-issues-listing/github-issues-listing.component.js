(function() {
    'use strict';

    angular
        .module('app')
        .component('githubIssuesListing', {
            templateUrl: 'app/github-issues-listing/github-issues-listing.component.html',
            bindings: {
                issues: '<'
            }
        });
})();
