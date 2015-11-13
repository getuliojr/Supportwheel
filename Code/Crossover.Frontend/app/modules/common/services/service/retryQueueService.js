(function () {

    'use strict';

    angular.module('modules.common.services.service.retryQueue', [
        
    ])

    .service('retryQueueService', retryQueueService);

    //Injeta dependencias
    retryQueueService.$inject = ['$q', '$log'];


    // This is a generic retry queue for security failures.  Each item is expected to expose two functions: retry and 
    function retryQueueService($q, $log) {
        var that = this;
        var retryQueue = [];

        // The public API of the service
        this.queue = function () { return that.retryQueue;}
        this.onItemAddedCallbacks = [];                   // The security service puts its own handler in here!
        this.cancelAll = cancelAll;
        this.hasMore = hasMore;
        this.push = push;
        this.pushRetryFn = pushRetryFn;
        this.retryAll = retryAll;
        this.retryReason = retryReason;
        
        //Funções
        function cancelAll() {
            while (this.hasMore()) {
                retryQueue.shift().cancel();
            }
        }
        function hasMore() {
            return retryQueue.length > 0;
        }
        function push(retryItem) {
            retryQueue.push(retryItem);
            // Call all the onItemAdded callbacks
            angular.forEach(that.onItemAddedCallbacks, function(cb) {
                try {
                    cb(retryItem);
                } catch(e) {
                    $log.error('retryQueueService.push(retryItem): callback threw an error' + e);
                }
            });
        }
        function pushRetryFn(reason, retryFn, args) {
            // The reason parameter is optional
            if ( arguments.length === 1) {
                retryFn = reason;
                reason = undefined;
            }

            // The deferred object that will be resolved or rejected by calling retry or cancel
            var deferred = $q.defer();
            var retryItem = {
                reason: reason,
                retry: function() {
                    // Wrap the result of the retryFn into a promise if it is not already
                    $q.when(retryFn.apply(this, args)).then(function(value) {
                        // If it was successful then resolve our deferred
                        deferred.resolve(value);
                    }, function(value) {
                        // Othewise reject it
                        deferred.reject(value);
                    });
                },
                cancel: function() {
                    // Give up on retrying and reject our deferred
                    deferred.reject();
                }
            };
            that.push(retryItem);
            return deferred.promise;
        }
        function retryAll() {
            var length = retryQueue.length;
            for (var r = 0; r < length; r++) {
                if (r <= retryQueue.length - 1) {
                    retryQueue.shift().retry();
                }
            }
        }
        function retryReason() {
            return that.hasMore() && retryQueue[0].reason;
        }
    }
})();
