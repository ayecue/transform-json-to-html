# transform-json-to-html

[![transform-json-to-html](https://circleci.com/gh/ayecue/transform-json-to-html.svg?style=svg)](https://circleci.com/gh/ayecue/transform-json-to-html)

# Install

```
npm i transform-json-to-html
```

# Description

Transform JSON into a HTML tree. Inspired by [json-formatter-js](https://github.com/mohsen1/json-formatter-js).

# Usage

```js
const { transform } = require('transform-json-to-html')
const obj = {
  test: 'was',
  moo: [
    'foo',
    'bar'
  ],
  inner: {
    'bar': 1,
    inner: {
      'foo': 2
    },
    inner2: new Map([['test', 'x']]),
    inner3: new Set(['was', 'wo'])
  },
  map: new Map([['test', 'x']]),
  set: new Set(['was', 'wo'])
};

obj.cyclic = obj;

const item = transform(obj, {
  depth: 4
});

document.getElementById('root').appendChild(item);
```

# API

`transform(object [, options])`

* `object` - Any object you want to transform into HTML.
* `options` - Optional argument to define options.
  * `depth` - Max depth for traversal.
  * `itemLimit` - Limit of items to display of value.
  * `collapseDepth` - Depth from where items should be collapsed by default.
  * `theme` - CSS theme to use.
  * `parseItem` - Parse item.
  * `onCollapse` - Callback for collapse event.

Returns HTMLElement.

## Default options:

```js
{
  "depth": 2,
  "itemLimit": 100,
  "collapseDepth": 2,
  "theme": "default",
  "parseItem": (v) => v;
  "onCollapse": (ev) => {};
}
```