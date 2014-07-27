/*
 * sauce-run
 * https://github.com/parroit/sauce-run
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var sauceRun = require('../lib/sauce-run.js');

describe('sauceRun', function(){
    this.timeout(10000000);

    it('is defined', function(){
      sauceRun.should.be.a('function');
    });

    it('run tests on sauce', function(done){
      
      sauceRun('http://www.parro.it/requesty/dist/test.html')
          .auth(process.env.REQUESTY_SAUCE_USERNAME, process.env.REQUESTY_SAUCE_ACCESS_KEY)
          .build(2)
          .browser('firefox', 'Windows 7' , '27')
          .browser('chrome', 'Windows 7' , '34')
          .browser('internet explorer', 'Windows 7' , '11')
          .run()
          .then(function(result){
              console.dir(result);
          })
          .then(done)
          .catch(done);
    });


});
