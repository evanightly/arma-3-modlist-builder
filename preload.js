const {
  modsPathFromCurrentFolder,
  modsPathFromArmaFolder,
  arma3FullPath,
  parameters,
  serverExecFileName,
} = require("./config.json");
const fs = require("fs");
let files = fs.readdirSync(modsPathFromCurrentFolder);

// Get files name starts with '@'
files = files.filter((item) => {
  return item.startsWith("@");
});

window.addEventListener("DOMContentLoaded", () => {
  // Header Logic
  document.getElementById("closeButton").addEventListener("click", () => {
    window.close();
  });

  // Files Selection
  let checkedMods = [];

  files.forEach((item, index) => {
    document.getElementById(
      "file-item"
    ).innerHTML += `<tr><td class="text-center"><input type="checkbox" name=[checkedMods] id="checkedMods" checked value=${index}></td><td>${item}</td></tr>`;
  });

  document.querySelectorAll('[type="checkbox"]').forEach((item) => {
    checkedMods.push(item.defaultValue);
    item.addEventListener("click", () => {
      if (item.checked === true) {
        checkedMods = [...checkedMods, item.defaultValue];
      } else if (item.checked === false) {
        let filteredMods = [];
        checkedMods.filter((item2) => {
          if (item.defaultValue !== item2) {
            filteredMods.push(item2);
          }
          checkedMods = filteredMods;
        });
      }
    });
  });

  // Start Build

  document.getElementById("buildButton").addEventListener("click", () => {
    let modList = '-mod="';
    checkedMods.forEach((index) => {
      let x = `${modsPathFromArmaFolder}${files[index]};`;
      modList += x;
    });
    console.log(modList);

    const BATFILEFORMAT = `@echo off 
    ${arma3FullPath} ${parameters} ${modList}"
    exit 0
    `;

    fs.writeFile(serverExecFileName + ".bat", BATFILEFORMAT, (err) => {
      if (err) throw err;
      console.log("Operation Completed!");
    });
  });

  process.on("uncaughtException", function (err) {
    console.log(err);
  });
});
