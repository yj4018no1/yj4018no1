require('babel-core/register');
require('babel-polyfill');

const path = require('path');
const babelCliDir = require('babel-cli/lib/babel/dir');

babelCliDir({
  retainLines: true,
  sourceMaps: true,
});

try {
  require(path.join(__dirname, 'mock'));
} catch (e) {
  if (e && e.code === 'MODULE_NOT_FOUND') {
    console.log('>>> [DEBUG]: run `npm compile` first!');
    process.exit(1);
  }
  console.log('>>> [DEBUG]: App started with error and exited'.red, e);
  process.exit(1);
}

console.log('>>> [DEBUG]: App started in debug mode');
