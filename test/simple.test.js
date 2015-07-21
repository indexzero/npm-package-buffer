'use strict';

var assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    zlib = require('zlib'),
    tar = require('tar'),
    PackageBuffer = require('../npm-package-buffer');

var fixturesDir = path.join(__dirname, 'fixtures');

describe('npm-package-buffer simple', function () {
  it('should untar and buffer a valid tar.Parse() stream', function (done) {
    var tarFile = path.join(fixturesDir, 'npm-package-buffer-0.0.0.tgz');
    var parser = tar.Parse();
    var buffer = new PackageBuffer(parser);
    var errState;

    //
    // Handle errors correctly by storing
    // the error state in this scope
    //
    function onError(err) {
      errState = err;
    }

    buffer
      .on('error', onError)
      .on('end', function () {
        assert.ok(!errState);
        assert.equal(typeof buffer.package, 'object');
        assert.equal(typeof buffer.pkg, 'object');
        assert.deepEqual(buffer.package, buffer.pkg);
        assert.deepEqual(Object.keys(buffer.files), [
          '.npmignore',
          'README.md',
          'LICENSE',
          'npm-package-buffer.js',
          'test/simple.test.js',
          'test/fixtures/not-a-tarball.tgz',
          'test/fixtures/npm-package-buffer-0.0.0.tgz'
        ]);

        done();
      });

    fs.createReadStream(tarFile)
      .pipe(zlib.Unzip())
      .on('error', onError)
      .pipe(parser);
  });
});
