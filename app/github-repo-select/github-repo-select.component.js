(function() {
    "use strict";
    angular.module("app").component("githubRepoSelect", {
        templateUrl: "app/github-repo-select/github-repo-select.component.html",
        controller: GithubRepoSelect,
        bindings: {
            repos: "<",
            onRepoSelect: "&",
            selectedRepo: "<"
        }
    });

    function GithubRepoSelect() {}
})();
