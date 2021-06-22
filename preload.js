const {
  modsPathFromCurrentFolder,
  modsPathFromArmaFolder,
  arma3FullPath,
  parameters,
  serverExecFileName,
} = require("./config.json");

const fs = require("fs");
const { dialog } = require("electron").remote;

let files = fs.readdirSync(modsPathFromCurrentFolder);
// Get files name starts with '@'
files = files.filter((item) => {
  return item.startsWith("@");
});

window.addEventListener("DOMContentLoaded", () => {
  // Inject JSON Settings
  document.getElementById("modPathEntry").textContent =
    modsPathFromCurrentFolder;
  document.querySelector("input#modPathFromArma").value =
    modsPathFromArmaFolder;
  document.querySelector("input#parameters").value = parameters;
  document.querySelector("input#filename").value = serverExecFileName;

  // Settings
  let initialSettings = require("./config.json");

  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", (e) => {
      initialSettings = { ...initialSettings, [e.target.name]: e.target.value };
      console.log(initialSettings);
    });
  });

  document.getElementById("settings").addEventListener("click", () => {
    document.querySelector(".settings").style.display = "flex";
  });

  document.getElementById("modPath").addEventListener("click", () => {
    dialog
      .showOpenDialog({
        title: "Select a folder",
        properties: ["openDirectory"],
      })
      .then((result) => {
        if (result.canceled !== true) {
          const finalResult = result.filePaths[0].replace(/\\/g, "/");
          initialSettings = {
            ...initialSettings,
            modsPathFromCurrentFolder: finalResult,
          };
        }
      });
  });

  document.querySelector("#closeSettings").addEventListener("click", () => {
    document.querySelector(".settings").style.display = "none";
  });

  document.getElementById("confirmSettings").addEventListener("click", () => {
    // Settings For Production
    fs.writeFile(
      __dirname + "/config.json",
      JSON.stringify(initialSettings),
      (failed) => {
        if (failed) console.error(failed);
      }
    );
    document.querySelector(".settings").style.display = "none";
    window.location.reload();
  });

  // Header
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
      dialog.showMessageBox({
        message: "Operation Completed!",
        title: "Arma 3 Modlist Builder",
        icon: __dirname + "/assets/images/icon.ico",
      });
    });
  });

  process.on("uncaughtException", function (err) {
    console.log(err);
  });
});
