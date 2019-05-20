const makeTree = require('./makeTree');
const json = require('./SystemViewController.json');

it('Should find 26 classes with the name "Input"', () => {
  const data = makeTree(json, 'Input', []);
  expect(data.length).toBe(26);
});

it('Should find 6 classNames containing "container"', () => {
  const data = makeTree(json, '.container', []);
  expect(data.length).toBe(6);
});

it('Should find 1 identifier with the name "videoMode"', () => {
  const data = makeTree(json, '#videoMode', []);
  expect(data.length).toBe(1);
});