const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 700,
    height: 400,
    center: true,
    fullscreen: false,
    frame: false,
    fullscreenable: false,
    movable: true,
    resizable: false,
    icon: path.join(__dirname, "/assets/images/taskbar.png"),
    webPreferences: { preload: path.join(__dirname, "preload.js"), enableRemoteModule:true },
  });
  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
  app.on(
    "activate",
    () => BrowserWindow.getAllWindows().length === 0 && createWindow()
  );
});

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());