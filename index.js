const https = require('https');
const urlModule = require('url');
const prettyPrint = require('./prettyPrint');
const readline = require('readline');
const makeTree = require('./makeTree');
const json = require('./SystemViewController.json');

function jsonSelector(json) {
  console.log(prettyPrint(`JSON parsed successfully.

    The program currently supports the following selectors. 

    class: e.g "Input"

    classNames: e.g ".container"

    identifier: e.g "#videoMode"

    If you want to see the views printed out neatly you can pass the flag --pretty

    Example: .container --pretty

    To clear the terminal just type cls and hit enter.

    To exit the program just type exit and hit enter.
  `))
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  rl.on('line', function (cmd) {
    if (cmd === 'cls') {
      return process.stdout.write('\033c');
    };
    if (cmd === 'exit') {
      rl.close();
      console.log('Bye.');
      return;
    };
    const prettyJSON = cmd.split(' ').find(command => command === '--pretty');
    if (prettyJSON) {
      const command = cmd.replace('--pretty', '').trim();
      const treeData = makeTree(json, command, []);
      console.log(JSON.stringify(treeData, null, 2));
      console.log('Found ' + treeData.length + ' views');
    } else {
      const treeData = makeTree(json, cmd, []);
      console.log(treeData);
      console.log('Found ' + treeData.length + ' views');
    };
  });
};

function useUrl(url) {
  const urlObj = urlModule.parse(url);
  const options = {
    host: urlObj.hostname,
    path: urlObj.path
  };
  https.get(options, (res) => {
    let json = ''
    res.on('data', (chunk) => {
      json += chunk;
    });
    res.on('end', function () {
      if (res.statusCode === 200) {
        try {
          let data = JSON.parse(json);
          jsonSelector(data);
        } catch (e) {
          console.log('Error parsing JSON');
        };
      } else {
        console.log('Status:', res.statusCode);
      };
    });
  });
};

function startProgram() {
  const flag = process.argv[2];
  const command = process.argv[3];
  
  switch(flag) {
    case '-url':
      useUrl(command);
      break;
    case '-file':
      jsonSelector(json);
      break;
    case undefined:
      console.log(prettyPrint(`parsejson requires a flag to parse any given json file.

        To parse json from a url use -url.
        Example: ./parsejson -url https://mellocloud.com/assets/json/SystemViewController.json (The file is in there.)

        To parse the json file SystemViewController.json included in the github repo use -file.
        Example: ./parsejson -file
      `));
      break;
    default:
      console.log(prettyPrint(`Invalid flag passed to parsejson "${flag}".
        Valid flags are -url and -file.
      `));
  };
};

startProgram();

module.exports = {
  startProgram
};