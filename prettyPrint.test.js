const prettyPrint = require('./prettyPrint');

it('Should remove indents but keep line breaks', () => {
  const string = prettyPrint(`
            Hello there

    How are you?
  `);
  const multiline = '\n' + 'Hello there\n\n' + 'How are you?\n';
  expect(string).toBe(multiline);
});