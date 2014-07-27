/*
 * sauce-run
 * https://github.com/parroit/sauce-run
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var requesty = require('requesty');
var Promise = require('bluebird');

function SauceRun(url) {
    if (!(this instanceof SauceRun)) {
        return new SauceRun(url);
    }


    this.browsers = [];
    this._auth = null;
    this.url = url;
    this.result = {
        ids: []
    };


}

SauceRun.prototype.auth = function(user, token) {
    this._auth = {
        user: user,
        token: token
    };

    return this;
};


SauceRun.prototype.browser = function(browser, os, version) {
    this.browsers.push([os, browser, version]);
    return this;
};


SauceRun.prototype.build = function(version) {
    this._build = version;
    return this;
};


SauceRun.prototype.run = function() {

    var build = this._build;
    var req = requesty.new();
    var ids = this.result.ids;
    var push = [].push;
    var user = this._auth.user;

    var runTests = req
        .post().usePromises()
        .using('https://saucelabs.com/rest/v1/' + user + '/js-tests')
        .auth({
            user: user,
            password: this._auth.token
        })
        .headers('content-type', 'application/json')
        .build();

    var getStatus = req
        .using({
            'path': '/rest/v1/' + user + '/js-tests/status'
        })
        .build();

    var setBuild = function(id, build) {
        //console.log(id);
        return req
            .using({
                'path': '/rest/v1/' + user + '/jobs/' + id
            })
            .put()
            .send({
                build: build
            });

    };

    var runOptions = {
        platforms: this.browsers,
        url: this.url,
        framework: 'mocha',
    };

    return new Promise(function(resolve, reject) {
        function resolveOnCompleted(ids) {
            getStatus({
                'js tests': ids
            })

            .then(function(result) {
                //console.log(JSON.stringify(result,null,'\t'));
                if (result.data.completed) {
                    
                    var setBuildAllTests = result.data['js tests'].map(function(test){
                        return setBuild(test.job_id, build);
                    });

                    Promise.all(setBuildAllTests)
                        .return(result.data)
                        .then(resolve)
                        .catch(reject);

                } else {
                    console.log('tests not completed, please wait...');

                    Promise
                        .resolve(ids)
                        .delay(5000)
                        .then(resolveOnCompleted);

                }
            })

            .catch(reject);
        }

        runTests(runOptions)

        .then(function(result) {
            return result.data['js tests'];

        })

        .then(resolveOnCompleted)

        .catch(reject);
    });


};

module.exports = SauceRun;
