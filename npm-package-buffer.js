'use strict';

var events = require('events'),
    util = require('util'),
    TarBuffer = require('tar-buffer');

/*
 * function PackageBuffer (parser, opts)
 * Represents a buffer for holding all tar data that is
 * emitted from "entry" events on the tar `parser` when that
 * tarball is assumed to be an npm package.
 */
var PackageBuffer = module.exports = function PackageBuffer(parser, opts) {
  if (!(this instanceof PackageBuffer)) { return new PackageBuffer(parser, opts); }

  opts = opts || {};
  opts.strip = opts.strip || 1;
  opts.maxSize = opts.maxSize || Math.pow(10, 6);

  TarBuffer.call(this, parser, opts);

  var self = this;
  this.files = {};
  this.on('entry', function (e) {
    if (e.path === 'package.json') {
      self.package = self.pkg = JSON.parse(e.content);
      return;
    }

    self.files[e.path] = e;
  });
};

util.inherits(PackageBuffer, TarBuffer);
