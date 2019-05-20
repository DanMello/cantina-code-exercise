function makeTree(json, selector, array) {
  let selectorType,selectorName;

  switch(selector[0]) {
    case '.':
      selectorType = 'classNames';
      selectorName = selector.slice(1);
      break;
    case '#':
      selectorType = 'identifier';
      selectorName = selector.slice(1);
      break;
    default:
      selectorType = 'class';
      selectorName = selector;
      break;
  };
  Object.keys(json).map(key => {
    const item = json[key];
    if (Array.isArray(item[selectorType])) {
      item[selectorType]
        .filter(className => className === selectorName)
        .forEach(() => {
          array.push(item);
        });
    };
    if (item[selectorType] === selectorName) {
      array.push(item);
    };
    return item;
  }).forEach(item => {
    typeof item === 'object' && makeTree(item, selector, array)
  });
  return array;
};

function filterTree(json, viewName) {
  return json.filter(items => items['class'] === viewName);
};

module.exports = {
  makeTree,
  filterTree
};