const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;

app.on("ready", () => {
  console.log("process.platform", process.platform);
  //kodun calisitigi yer ana kisim
  console.log("hazir");
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  }); //pencere icin gerekli paramatre olarak obje alir

  // file://electron/main.html
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "main.html"),
      protocol: "file",
      slashes: true,
    })
  );

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  ipcMain.on("key", (err, data) => {
    console.log("data", data);
  });
  ipcMain.on("key:inputValue", (err, data) => {
    console.log("inputValue", data);
  });

  //Yeni Pencere
  ipcMain.on("key:newWindow", () => {
    createWindow();
  });

  mainWindow.on('close',()=>{
      //ana pencere kapandiginda kucuk pencere acik kaliyordu bu islem sayesinde sistemden komple kapanacak
      app.quit();
  })
});

const mainMenuTemplate = [
  {
    label: "Dosya",
    submenu: [
      {
        label: "Yeni TODO Ekle",
      },
      {
        label: "Tumunu Sil",
      },
      {
        label: "Cikis",
        role: "quit", //uygulamayi kapatmak icin(otomatik olarak kendisi kisa yol atar)
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q", //kisa yolu kendimiz verdik
      },
    ],
  },
];

if (process.platform == "darwin") {
  mainMenuTemplate.unshift({
    label: app.getName(),
  });
}

if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Dev Tools",
    submenu: [
      {
        label: "Gelistirici Penceresini Ac",
        click(item, focusedWindow) {
          //tiklama islemi 2 parametre alir
          focusedWindow.toggleDevTools();
        },
      },
      {
        lable: "Yenile",
        role: "reload",
      },
    ],
  });
}

function createWindow() {
  addWindow = new BrowserWindow({
    width: 482,
    height: 200,
    title: "Yeni Bir Pencere",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "modal.html"),
      protocol: "file",
      slashes: true,
    })
  );

  addWindow.on('close',()=>{
      addWindow = null;
  })
}
