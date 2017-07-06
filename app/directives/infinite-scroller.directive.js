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
