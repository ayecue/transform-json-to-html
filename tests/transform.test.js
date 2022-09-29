const { JSDOM } = require('jsdom');
const dom = new JSDOM();

global.document = dom.window.document
global.window = dom.window

const { transform } = require('../dist/index.cjs.js');

describe('transform', function () {
  test('simple', function () {
    const result = transform({
      test: 'was'
    });

    expect(result).toMatchSnapshot();
  });

  test('cyclic', function() {
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

    const result = transform(obj);

    expect(result).toMatchSnapshot();
  });

  test('primitive', function() {
    const result = transform("test");
    expect(result).toMatchSnapshot();
  });

  test('use parseItem', function() {
    const result = transform({
      test: 'was'
    }, {
      parseItem: (v) => {
        if (typeof v === 'string') {
          return v + 'modified!!!'
        }
        return v;
      }
    });
    expect(result).toMatchSnapshot();
  });

  test('null + undefined', function() {
    const result = transform({
      bar1: undefined,
      bar2: null
    });
    expect(result).toMatchSnapshot();
  });

  test('too big array', function() {
    const result = transform({
      toBigArray: new Array(150).fill('x').map((v, i) => v + i)
    }, {
      itemLimit: 10
    });
    expect(result).toMatchSnapshot();
  });

  test('too big object', function() {
    const arr = new Array(150).fill('x').map((v, i) => v + i);
    const obj = {};

    for (const item of arr) {
      obj[item] = 'v' + item;
    }

    const result = transform(obj, {
      itemLimit: 10
    });
    expect(result).toMatchSnapshot();
  });

  test('too big map', function() {
    const arr = new Array(150).fill('x').map((v, i) => v + i);
    const obj = new Map();

    for (const item of arr) {
      obj.set(item, 'v' + item);
    }

    const result = transform(obj, {
      itemLimit: 10
    });
    expect(result).toMatchSnapshot();
  });

  test('too big set', function() {
    const arr = new Array(150).fill('x').map((v, i) => v + i);
    const obj = new Set();

    for (const item of arr) {
      obj.add(item);
    }

    const result = transform(obj, {
      itemLimit: 10
    });
    expect(result).toMatchSnapshot();
  });
});
