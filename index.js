#!/usr/bin/env node
var path = require('path');
var argv = require('optimist').argv;

var app = require(path.join(__dirname, 'lib/app'));
app(argv);
