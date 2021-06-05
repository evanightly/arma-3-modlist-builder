const fs = require("fs");
const {
  modsPathFromCurrentFolder,
  modsPathFromArmaFolder,
  arma3FullPath,
  parameters,
  serverExecFileName,
} = require("./config.json");

let files = fs.readdirSync(modsPathFromCurrentFolder);
let modList = '-mod="';

files.filter((e) => {
  if (e.startsWith("@")) {
    let x = `${modsPathFromArmaFolder}${e.trim()};`;
    modList += x;
  }
});

const BATFILEFORMAT = `@echo off
${arma3FullPath} ${parameters} ${modList}"
exit 0
`;

fs.writeFile(serverExecFileName + '.bat', BATFILEFORMAT, (err) => {
  if (err) throw err;
  console.log("Operation Completed!");
});
