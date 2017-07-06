(function() {
    'use strict';

    // Module definition
    angular.module('app', []);

    // When the DOM is ready...
    angular.element(document).ready(function() {

        // ... kickstart everything
        // angular.bootstrap(document, ['app']);
    });
})();

(function() {
    'use strict';

    githubService.$inject = ["$http", "GithubRepoModel", "GithubIssueModel"];
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

(function() {
    'use strict';

    angular
        .module('app')
        .factory('GithubIssueModel', GithubIssueModel);

    function GithubIssueModel() {
        function GithubIssue(config) {
            this.id = config.id;
            this.title = config.title;
            this.number = config.number;
            this.comments = config.comments;
            this.state = config.state;
            this.closed_at = config.closed_at;
            this.updated_at = config.updated_at;
        }

        return GithubIssue;
    }
})();

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

(function() {
    'use strict';
    angular
        .module('app')
        .directive('infiniteScroller', infiniteScroller);

    function infiniteScroller() {
        return {
            link: link,
            restrict: 'A',
            scope: {
                scrollBuffer: '@',
                onScrollEnd: '&',
                disabled: '<'
            }
        };

        function link($scope) {
            window.addEventListener('scroll', onScroll);

            function onScroll() {
                var buffer = parseScrollBuffer($scope.scrollBuffer);
                var vpHeight = document.body.offsetHeight - window.innerHeight;

                if (!$scope.disabled && (vpHeight - buffer) <= document.body.scrollTop) {
                    $scope.onScrollEnd();
                }
            }


            $scope.$on('$destroy', function() {
                window.removeEventListener('scroll', onScroll);
            });
        }
    }

    function parseScrollBuffer(heightInPx) {
        return +(heightInPx.slice(0, -2));
    }
})();

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

(function() {
    'use strict';

    GithubApp.$inject = ["githubService"];
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

(function() {
    'use strict';

    angular
        .module('app')
        .component('relativeTime', {
            templateUrl: 'app/relative-time/relative-time.component.html',
            bindings: {
                date: '<'
            },
            controller: RelativeTime
        });

    function RelativeTime() {

        this.$onInit = $onInit;

        function $onInit() {
            this.formattedDate = formatDate(this.date);
        }

        function formatDate(date) {
            //convert a UTF date
            var pastDate = new Date(date);
            var currDate = Date.now();
            // get total difference in seconds between the times
            var delta = Math.abs(currDate - pastDate) / 1000;
            // calculate whole days
            var days = Math.floor(delta / 86400);
            // calculate whole hours
            var hours = Math.floor(delta / 3600) % 24;
            // calculate whole minutes
            var minutes = Math.floor(delta / 60) % 60;
            // what's left is seconds
            var seconds = delta % 60; // in theory the modulus is not required

            if (days > 0) {
                return days + ' days ago';
            } else if (hours > 0) {
                return hours + ' hours ago';
            } else if (minutes > 0) {
                return minutes + ' minutes ago';
            } else if (seconds > 0) {
                return seconds + ' seconds ago';
            }
        }
    }
})();
