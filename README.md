# Randoc

> Generates random documents based on a simple schema using [Chance.js](http://chancejs.com/) functions.

[![npm version](https://badge.fury.io/js/randoc.svg)](https://badge.fury.io/js/randoc)
[![Build Status](https://travis-ci.org/rouanw/randoc.svg?branch=master)](https://travis-ci.org/rouanw/randoc)
![Dependency Status](https://david-dm.org/rouanw/randoc.svg)
![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)

Handy for creating test / stub data.

## Getting started

### Install

```sh
$ npm install --save randoc
```

### Create one random document

```js
const { randomDocument } = require('randoc');

const oneDoc = randomDocument({ name: 'name', age: 'age' });

// { name: 'Jorge Floyd', age: 60 }
```

Where `name` and `age` are both [Chance.js](http://chancejs.com/) functions.

### Create many random documents

```js
const { randomDocuments } = require('randoc');

const lots = randomDocuments({ name: 'first', employed: 'bool' }, 7);

/* [ { name: 'Chase', employed: false },
  { name: 'Alejandro', employed: true },
  { name: 'Lewis', employed: true },
  { name: 'Lulu', employed: true },
  { name: 'Ora', employed: false },
  { name: 'Tony', employed: false },
  { name: 'Nellie', employed: false }]
*/
```

## Schema

The schema types `randoc` uses loosely map to functions offered by [Chance.js](http://chancejs.com/), with a few additional options.

### Simple Chance.js types

The simplest schema looks something like:

```js
const schema = { isMonday: 'bool' };
const doc = randomDocument(schema);
// { isMonday: false }
```

### Passing an argument to the Chance.js function

```js
const schema = { isMonday: { _type: 'bool', args: { likelihood: 1/7 } } };
const doc = randomDocument(schema);
// { isMonday: false }
```

Another example:

```js
randomDocument({ name: 'name', age: { _type: 'natural', args: { max: 80 } } });
// { name: 'Norman McCoy', age: 9 }
```

### Nested objects

`randoc` supports nested objects:

```js
const schema = { isMonday: 'bool', weather: { rain: 'bool', snow: 'bool' } };
const doc = randomDocument(schema);
// { isMonday: false, weather: { rain: true, snow: true } }
```

### Arrays

```js
const schema = { days: [ { isMonday: 'bool' } ] };
const doc = randomDocument(schema);
// { days: [ { isMonday: false } ] }
```

`randoc` does not currently support multiple items. Open a [Pull Request](https://github.com/rouanw/randoc/pulls) if you're eager.

### Special types

These are types not offered directly by Chance.js functions.

#### Enum

You may want to pick a value from a list of options:

```js
const schema = { status: { _type: 'enum', options: ['new', 'available', 'expired'] } };
const doc = randomDocument(schema);
// { status: 'available' }
```

#### Properties that may not exist

The example below has a 70% chance of including a `status` property:

```js
const schema = { name: 'name', status: { _type: 'enum', _exists: 70, options: ['new', 'available', 'expired'] } };
const doc = randomDocument(schema);
//
```

Note that `_exists` is currently only available for "special" types.

### A more complete example

Here's an example schema that showcases some of the available functionality:

```js
const schema = {
  widget: {
    name: 'string',
    storeId: {
      _type: 'enum',
      options: [543, 999, 1232, 110],
    },
    deleted: {
      _type: 'bool',
      args: {
        likelihood: 5,
      },
    },
    startDate: 'date',
    outOfStock: {
      _type: 'bool',
      args: {
        likelihood: 10,
      },
    },
    discountable: {
      _type: 'bool',
      args: {
        likelihood: 90,
      },
    },
  },
  status: {
    _type: 'enum',
    options: ['new', 'active', 'cancelled', ''],
  },
};
/*
{ widget:
   { name: 'vU9SpLn3ZfsW3hud%DT',
     storeId: 1232,
     deleted: false,
     startDate: 2103-10-13T14:26:33.440Z,
     outOfStock: false,
     discountable: true },
  status: 'new' }
*/
```

## License
MIT
