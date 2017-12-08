import angular from 'angular';

RetryQueueService.$inject = ['$q', '$log'];

class RetryQueueService {

    constructor($q, $log) {
        this.$q = $q;
        this.$log = $log;
        this.retryQueue = [];

        // The security service puts its own handler in here!
        this.onItemAddedCallbacks = [];                  

    }

    cancelAll() {
        while (this.hasMore()) {
            this.retryQueue.shift().cancel();
        }
    }

    hasMore() {
        return this.retryQueue.length > 0;
    }

    push(retryItem) {
        this.retryQueue.push(retryItem);

        // Call all the onItemAdded callbacks
        angular.forEach(this.onItemAddedCallbacks, function (cb) {
            try {
                cb(retryItem);
            } catch (e) {
                this.$log.error('retryQueueService.push(retryItem): callback threw an error' + e);
            }
        });
    }

    pushRetryFn(reason, retryFn, args) {
        // The reason parameter is optional
        if (arguments.length === 1) {
            retryFn = reason;
            reason = undefined;
        }

        // The deferred object that will be resolved or rejected by calling retry or cancel
        let deferred = this.$q.defer();
        let retryItem = {
            reason: reason,
            retry: function () {
                // Wrap the result of the retryFn into a promise if it is not already
                this.$q.when(retryFn.apply(this, args)).then(function (value) {
                    // If it was successful then resolve our deferred
                    deferred.resolve(value);
                }, function (value) {
                    // Othewise reject it
                    deferred.reject(value);
                });
            },
            cancel: function () {
                // Give up on retrying and reject our deferred
                deferred.reject();
            }
        };
        this.push(retryItem);
        return deferred.promise;
    }

    retryAll() {
        let length = this.retryQueue.length;
        for (var r = 0; r < length; r++) {
            if (r <= this.retryQueue.length - 1) {
                this.retryQueue.shift().retry();
            }
        }
    }

    retryReason() {
        return this.hasMore() && this.retryQueue[0].reason;
    }
}

export default angular
    .module('app.shared.services.retryQueue', [])
    .service('retryQueueService', RetryQueueService)
    .name;