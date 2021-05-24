const {
  modsPathFromCurrentFolder,
  modsPathFromArmaFolder,
  arma3FullPath,
  parameters,
  serverExecFileName,
} = require("./config.json");
const fs = require("fs");
const files = fs.readdirSync(modsPathFromCurrentFolder);

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("closeButton").addEventListener("click", () => {
    window.close();
  });
  document.getElementById("buildButton").addEventListener("click", () => {
    let modList = "-mod=";
    files.forEach((i) => {
      if (i !== "build") {
        let x = `${modsPathFromArmaFolder}${i.trim()};`;
        modList += x;
      }
    });

    const BATFILEFORMAT = `@echo off 
${arma3FullPath} ${parameters} ${modList}
exit 0
`;

    fs.writeFile(serverExecFileName + ".bat", BATFILEFORMAT, (err) => {
      if (err) throw err;
      console.log("Operation Completed!");
    });
  });
  console.log(process);
  process.on("uncaughtException", function (err) {
    console.log(err);
  });
});
