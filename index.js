const https = require('https');
const urlModule = require('url');
const prettyPrint = require('./prettyPrint');
const readline = require('readline');
const jsonRecursion = require('./jsonRecursion');
const json = require('./SystemViewController.json');

function printPrettyTree(data, cmd, viewName) {
  let jsonData;
  let command = viewName ? cmd : cmd.replace('--pretty', '').trim();
  const treeData = jsonRecursion.makeTree(data, command, []);
  if (viewName) {
    jsonData = jsonRecursion.filterTree(treeData, viewName);
  } else {
    jsonData = treeData;
  };
  console.log(JSON.stringify(jsonData, null, 2));
  console.log('Found ' + jsonData.length + ((jsonData.length > 1 || jsonData.length === 0) ? ' views ' : ' view ') + 'with the selector ' + command);
};

function printNormal(data, cmd, viewName) {
  let jsonData;
  const treeData = jsonRecursion.makeTree(data, cmd, []);
  if (viewName) {
    jsonData = jsonRecursion.filterTree(treeData, viewName);
  } else {
    jsonData = treeData;
  };
  console.log(jsonData);
  console.log('Found ' + jsonData.length + ((jsonData.length > 1 || jsonData.length === 0) ? ' views ' : ' view ') + 'with the selector ' + cmd);
};

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
    const commands = cmd.replace('--pretty', '').trim().split(' ');
    const compoundSelector = RegExp(/(\w+[#.])\w+/g);

    if (commands.length > 1) {
      commands.forEach(command => {
        if (prettyJSON) {
          printPrettyTree(json, command);
        } else {
          printNormal(json, command);
        };
      });
    } else if (compoundSelector.test(cmd)) {
      const command = cmd.replace('--pretty', '').trim()
      const selectorArray = command.split(/[#.]/);
      const selectorType = (command.indexOf('#') !== -1) ? '#' : '.';
      const viewName = selectorArray[0];
      const selectorName = selectorType + selectorArray[1];
      if (prettyJSON) {
        printPrettyTree(json, selectorName, viewName);
      } else {
        printNormal(json, selectorName, viewName);
      };
    } else {
      if (prettyJSON) {
        printPrettyTree(json, cmd);
      } else {
        printNormal(json, cmd);
      };
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

let data = [
  {
    "class": "VideoModeSelect",
    "identifier": "videoMode"
  }
]

jsonRecursion.filterTree(data, 'VideoModeSelect', [])
startProgram();

module.exports = {
  startProgram
};