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
    it('is defined', function(){
      sauceRun.should.be.a('function');
    });

});
