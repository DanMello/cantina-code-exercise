module.exports = function prettyPrint(string) {
  return string.split('\n')
    .reduce((acc, current, index) => {
      let string = acc;
      if (index === 0) {
        if (current === '') {
          return string
        } else {
          return `${string}${current.replace(/^\s+|\s+$/gm,'')}`
        };
      } else {
        if (current === '') {
          return `${string}\n`
        } else {
          return `${string}\n${current.replace(/^\s+|\s+$/gm,'')}`
        };
      };
    }, '');
};