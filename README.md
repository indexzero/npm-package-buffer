# npm-package-buffer

Buffers entries from a tar.Parse() stream for an npm package into memory

## Usage

``` js
var fs = require('fs');
var zlib = require('zlib');
var tar = require('tar');
var PackageBuffer = require('npm-package-buffer');

var parser = tar.Parse();
var buffer = new PackageBuffer(parser)
  .on('error', function (err) { console.log ('tar error: %s', err); })
  .on('end', function () {
    //
    // Log fully read the package.json
    //
    console.dir(buffer.package);

    //
    // Log all our files in memory
    //
    console.dir(buffer.files);
  });

//
// Read our tarball and pipe it to the tar parser.
//
fs.createReadStream('any-npm-package-1.2.3.tgz')
  .pipe(zlib.Unzip())
  .on('error', function (err) { console.log('zlib error: %s', err); })
  .pipe(parser);
```

### API

See also: [`tar-buffer`](https://github.com/indexzero/tar-buffer).

#### Options

- `log`: (optional) Log function to use. Expects `console.log` API.

#### Why isn't this a proper stream?

Underneath the covers, `tar` emits several events, not just `data` events which have to be handled seprately from a traditional stream.
