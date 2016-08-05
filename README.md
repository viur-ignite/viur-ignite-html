[![npm version](https://badge.fury.io/js/viur-ignite-html.svg)](https://badge.fury.io/js/viur-ignite-html)
[![Dependency Status](https://david-dm.org/viur-ignite/viur-ignite-html.svg)](https://david-dm.org/viur-ignite/viur-ignite-html)
[![Build Status](https://travis-ci.org/viur-ignite/viur-ignite-html.svg?branch=master)](https://travis-ci.org/viur-ignite/viur-ignite-html)
[![GitHub license](https://img.shields.io/badge/license-GPL-blue.svg)](https://raw.githubusercontent.com/viur-ignite/viur-ignite-html/master/LICENSE)

# VIUR Ignite HTML
>The ViUR Ignite Framework is the first attempt in building a sturdy foundation for ViUR products and Mausbrand projects.

VIUR Ignite HTML is designed to build small websites with an simple template

For a detailed introduction and examples have a look at [http://ignite.viur.is](http://ignite.viur.is).


## Install
```
$ npm install viur-ignite-html
```

## Usage
```js
const gulp = require('gulp');
const html = require('viur-ignite-html');

gulp.task('default', function() {
  return html.build();
});
```

Create your html template in _layout.html, add content files in your sources folder and add them to the _menu.json and build them with
```
$ gulp
```


### Be individual
Call the function with an object of options
```js
gulp.task('default', function() {
  return html.build({
	dest: './output/html/'
  });
});
```

The Default options are:
```js
src: './sources/html/',
dest: './appengine/html/'
```

## Contribution guidelines
* Available for use under the GPL-3.0 license

## Who do I talk to?
* [@phneutral](https://github.com/phneutral)
* [@sveneberth](https://github.com/sveneberth)
