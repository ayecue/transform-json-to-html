import './index.less';

export const TRANSFORM_CLASSNAME_PREFIX = 'json-html';
export const DEFAULT_MAX_DEPTH = 2;
export const DEFAULT_ITEM_LIMIT = 100;
export const DEFAULT_COLLAPSE_DEPTH = 2;

export enum Theme {
  Dark = 'dark',
  Default = 'default'
}

export enum SupportedTypes {
  Undefined = 'undefined',
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Null = 'null',
  Map = 'map',
  Array = 'array',
  Object = 'object',
  Set = 'set'
}

type GenerateElementCallback = (item: any) => HTMLElement;

function getClassName(className: string) {
  return `${TRANSFORM_CLASSNAME_PREFIX}-${className}`;
}

function generatePrimitiveType(
  type: SupportedTypes,
  value: any
): HTMLSpanElement {
  const item = document.createElement('span');
  item.classList.add(getClassName(type));
  item.innerHTML = value.toString();
  return item;
}

function generateEOL(): HTMLSpanElement {
  const eoItem = document.createElement('span');

  eoItem.classList.add(getClassName('eol'));
  eoItem.innerHTML = '...';

  return eoItem;
}

function generateWrappedEOL(
  leftSign: string,
  rightSign: string,
  keywordType?: string
): HTMLSpanElement {
  const container = document.createElement('span');
  const left = document.createElement('span');
  const right = document.createElement('span');

  container.classList.add(getClassName('eol-container'));

  left.classList.add(getClassName('left'));
  left.innerHTML = leftSign;

  right.classList.add(getClassName('right'));
  right.innerHTML = rightSign;

  if (keywordType) {
    const typeKeyword = document.createElement('span');
    typeKeyword.classList.add(getClassName('keyword'));
    typeKeyword.innerHTML = keywordType;
    container.appendChild(typeKeyword);
  }

  container.appendChild(left);
  container.appendChild(generateEOL());
  container.appendChild(right);

  return container;
}

interface BodyResult {
  container: HTMLDivElement;
  body: HTMLUListElement;
}

function generateBody(parent: HTMLElement, isCollapsed: boolean): BodyResult {
  const container = document.createElement('div');
  const body = document.createElement('ul');
  const collapsedClassName = getClassName('collapsed');

  container.classList.add(getClassName('body-container'));
  body.classList.add(getClassName('body'));

  if (isCollapsed) {
    container.classList.add(collapsedClassName);
  }

  parent.addEventListener('click', (ev: Event) => {
    ev.preventDefault();
    ev.stopPropagation();

    if (container.classList.contains(collapsedClassName)) {
      container.classList.remove(collapsedClassName);
    } else {
      container.classList.add(collapsedClassName);
    }
  });

  container.appendChild(body);

  return {
    container,
    body
  };
}

function generateArrayType(
  value: any[],
  isCollapsed: boolean,
  itemLimit: number,
  generateCallback: GenerateElementCallback
): HTMLDivElement {
  const item = document.createElement('div');
  const startBracket = document.createElement('span');
  const { container, body } = generateBody(item, isCollapsed);
  const endBracket = document.createElement('span');

  startBracket.classList.add(getClassName('start-bracket'));
  endBracket.classList.add(getClassName('end-bracket'));

  startBracket.innerHTML = '[';
  endBracket.innerHTML = ']';

  item.classList.add(getClassName(SupportedTypes.Array));

  item.appendChild(startBracket);
  item.appendChild(container);
  item.appendChild(endBracket);

  for (let index = 0; index < value.length; index++) {
    const current = value[index];
    const line = document.createElement('li');

    if (index > itemLimit) {
      line.appendChild(generateEOL());
    } else {
      const v = document.createElement('span');

      v.classList.add(getClassName('value'));
      v.appendChild(generateCallback(current));

      line.appendChild(v);

      if (value.length - 1 > index) {
        const sep = document.createElement('span');
        sep.classList.add(getClassName('seperator'));
        sep.innerHTML = ',';
        line.appendChild(sep);
      }
    }

    body.appendChild(line);
  }

  return item;
}

function generateSetType(
  value: Set<any>,
  isCollapsed: boolean,
  itemLimit: number,
  generateCallback: GenerateElementCallback
): HTMLDivElement {
  const item = document.createElement('div');
  const typeKeyword = document.createElement('span');
  const startBracket = document.createElement('span');
  const { container, body } = generateBody(item, isCollapsed);
  const endBracket = document.createElement('span');

  typeKeyword.classList.add(getClassName('keyword'));
  startBracket.classList.add(getClassName('start-bracket'));
  endBracket.classList.add(getClassName('end-bracket'));

  typeKeyword.innerHTML = 'Set';
  startBracket.innerHTML = '{';
  endBracket.innerHTML = '}';

  item.classList.add(getClassName(SupportedTypes.Set));

  item.appendChild(typeKeyword);
  item.appendChild(startBracket);
  item.appendChild(container);
  item.appendChild(endBracket);

  let index = 0;

  for (const current of value) {
    const line = document.createElement('li');

    if (index > itemLimit) {
      line.appendChild(generateEOL());
    } else {
      const v = document.createElement('span');

      v.classList.add(getClassName('value'));
      v.appendChild(generateCallback(current));

      line.appendChild(v);

      if (value.size - 1 > index) {
        const sep = document.createElement('span');
        sep.classList.add(getClassName('seperator'));
        sep.innerHTML = ',';
        line.appendChild(sep);
      }
    }

    body.appendChild(line);
    index++;
  }

  return item;
}

function generateMapType(
  value: Map<any, any>,
  isCollapsed: boolean,
  itemLimit: number,
  generateCallback: GenerateElementCallback
): HTMLDivElement {
  const item = document.createElement('div');
  const typeKeyword = document.createElement('span');
  const startBracket = document.createElement('span');
  const { container, body } = generateBody(item, isCollapsed);
  const endBracket = document.createElement('span');

  typeKeyword.classList.add(getClassName('keyword'));
  startBracket.classList.add(getClassName('start-bracket'));
  endBracket.classList.add(getClassName('end-bracket'));

  typeKeyword.innerHTML = 'Map';
  startBracket.innerHTML = '{';
  endBracket.innerHTML = '}';

  item.classList.add(getClassName(SupportedTypes.Map));

  item.appendChild(typeKeyword);
  item.appendChild(startBracket);
  item.appendChild(container);
  item.appendChild(endBracket);

  let index = 0;

  for (const [key, current] of value) {
    const line = document.createElement('li');

    if (index > itemLimit) {
      line.appendChild(generateEOL());
    } else {
      const left = document.createElement('span');
      const sep = document.createElement('span');
      const right = document.createElement('span');

      left.classList.add(getClassName('key'));
      sep.classList.add(getClassName('seperator'));
      right.classList.add(getClassName('value'));

      left.appendChild(generateCallback(key));
      sep.innerHTML = ':';
      right.appendChild(generateCallback(current));

      line.appendChild(left);
      line.appendChild(sep);
      line.appendChild(right);
    }

    body.appendChild(line);
    index++;
  }

  return item;
}

function generateObjectType(
  value: any,
  isCollapsed: boolean,
  itemLimit: number,
  generateCallback: GenerateElementCallback
): HTMLDivElement {
  const item = document.createElement('div');
  const startBracket = document.createElement('span');
  const { container, body } = generateBody(item, isCollapsed);
  const endBracket = document.createElement('span');

  startBracket.classList.add(getClassName('start-bracket'));
  endBracket.classList.add(getClassName('end-bracket'));

  startBracket.innerHTML = '{';
  endBracket.innerHTML = '}';

  item.classList.add(getClassName(SupportedTypes.Object));

  item.appendChild(startBracket);
  item.appendChild(container);
  item.appendChild(endBracket);

  const keys = Object.keys(value);

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const current = value[key];
    const line = document.createElement('li');

    if (index > itemLimit) {
      line.appendChild(generateEOL());
    } else {
      const left = document.createElement('span');
      const sep = document.createElement('span');
      const right = document.createElement('span');

      left.classList.add(getClassName('key'));
      sep.classList.add(getClassName('seperator'));
      right.classList.add(getClassName('value'));

      left.appendChild(generateCallback(key));
      sep.innerHTML = ':';
      right.appendChild(generateCallback(current));

      line.appendChild(left);
      line.appendChild(sep);
      line.appendChild(right);
    }

    body.appendChild(line);
  }

  return item;
}

export interface TransformOptions {
  depth: number;
  itemLimit: number;
  collapseDepth: number;
  theme: Theme;
}

export function transform(
  json: any,
  options: Partial<TransformOptions> = {}
): HTMLDivElement {
  const maxDepth = options.depth || DEFAULT_MAX_DEPTH;
  const itemLimit = options.itemLimit || DEFAULT_ITEM_LIMIT;
  const collapseDepth = options.collapseDepth || DEFAULT_COLLAPSE_DEPTH;
  const theme = options.theme || Theme.Default;
  const generate = (item: any, depth: number = 0): HTMLElement => {
    const itemType = typeof item;
    const nextDepth = depth + 1;

    switch (itemType) {
      case SupportedTypes.Undefined:
        return generatePrimitiveType(SupportedTypes.Undefined, item);
      case SupportedTypes.String:
        return generatePrimitiveType(SupportedTypes.String, item);
      case SupportedTypes.Number:
        return generatePrimitiveType(SupportedTypes.Number, item);
      case SupportedTypes.Boolean:
        return generatePrimitiveType(SupportedTypes.Boolean, item);
      case SupportedTypes.Object: {
        if (item === null) {
          return generatePrimitiveType(SupportedTypes.Null, 'null');
        }

        const isCollapsed = collapseDepth < nextDepth;
        const generateCallback = (v: any) => generate(v, nextDepth);

        if (Array.isArray(item)) {
          if (nextDepth > maxDepth) return generateWrappedEOL('[', ']');
          return generateArrayType(
            item,
            isCollapsed,
            itemLimit,
            generateCallback
          );
        } else if (item instanceof Map) {
          if (nextDepth > maxDepth) return generateWrappedEOL('{', '}', 'Map');
          return generateMapType(
            item,
            isCollapsed,
            itemLimit,
            generateCallback
          );
        } else if (item instanceof Set) {
          if (nextDepth > maxDepth) return generateWrappedEOL('{', '}', 'Set');
          return generateSetType(
            item,
            isCollapsed,
            itemLimit,
            generateCallback
          );
        }

        if (nextDepth > maxDepth) return generateWrappedEOL('{', '}');
        return generateObjectType(
          item,
          isCollapsed,
          itemLimit,
          generateCallback
        );
      }
      default:
        throw new Error(`Unexpected type.`);
    }
  };
  const body = generate(json);
  const result = document.createElement('div');

  result.appendChild(body);
  result.classList.add(getClassName('container'), getClassName(theme));

  return result;
}
