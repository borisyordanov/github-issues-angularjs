(function() {
    'use strict';
    angular.module('app').component('relativeTime', {
        templateUrl: 'app/relative-time/relative-time.component.html',
        bindings: {
            date: '<'
        },
        controller: RelativeTime
    });

    function RelativeTime() {
        this.$onInit = $onInit;
        this.formattedDate = '';
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
