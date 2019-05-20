const jsonRecursion = require('./jsonRecursion');
const json = require('./SystemViewController.json');

it('Should find 26 classes with the name "Input"', () => {
  const data = jsonRecursion.makeTree(json, 'Input', []);
  expect(data.length).toBe(26);
});

it('Should find 6 classNames containing "container"', () => {
  const data = jsonRecursion.makeTree(json, '.container', []);
  expect(data.length).toBe(6);
});

it('Should find 1 identifier with the name "videoMode"', () => {
  const data = jsonRecursion.makeTree(json, '#videoMode', []);
  expect(data.length).toBe(1);
});

it('Should find 1 view with the class "videoModeSelect" and identifier "videoMode"', () => {
  const data = jsonRecursion.makeTree(json, '#videoMode', []);
  const fitlereddata = jsonRecursion.filterTree(data, 'VideoModeSelect');
  expect(fitlereddata.length).toBe(1);
});

it('Should not find view with the class "CvarCheckbox" and identifier "videoMode"', () => {
  const data = jsonRecursion.makeTree(json, '#videoMode', []);
  const fitlereddata = jsonRecursion.filterTree(data, 'CvarCheckbox');
  expect(fitlereddata.length).toBe(0);
});