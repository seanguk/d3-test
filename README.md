# d3-test

A basic d3 test setup with:
- Gulp build setup including typescript transpilation, commonjs and concatenation (browserify( and minification (uglify).
- Client side (typescript) that will show a basic radial graph representation using d3.
- Express server that generates simple 2 level random graphs.

## Running
Run `node server/app.js` to start the server

## Development
Run `grunt watch` (after installing grunt-cli) to automatically build new changes
