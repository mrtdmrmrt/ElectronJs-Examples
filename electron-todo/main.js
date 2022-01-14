const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;
let todoList = [];

app.on("ready", () => {
  //Pencerenin Olusturulmasi
  mainWindow = new BrowserWindow({
    frame: false, //pencerede ki kapatma buyumet isaretlerini kapatiyor
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  //Cikis Islemi
  ipcMain.on("todo:quit", () => {
      app.quit();
      mainWindow = null;
  });

  //Pencerenin saga veya sola genisletemiyorsunuz
  mainWindow.setResizable(false);

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "pages/mainWindow.html"),
      protocol: "file",
      slashes: true,
    })
  );

  //Menu Olusturulmasi
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  //NewTODO Penceresi Eventleri
  ipcMain.on("newTodo:close", () => {
    addWindow.close();
    addWindow = null;
  });

  ipcMain.on("newTodo:save", (err, data) => {
    console.log("gelen data->", data);
    if (data) {
      let todo = {
        id: todoList.length + 1,
        text: data.todoValue,
      };
      todoList.push(todo);

      //backenden frontend`e bilgi gondermek icin
      mainWindow.webContents.send("todo:addItem", todo);

      if (data.ref === "new") {
        addWindow.close();
        addWindow = null;
      }
    }
  });
});

//Menu Teamplate Yapisi
const mainMenuTemplate = [
  {
    label: "Dosya",
    submenu: [
      {
        label: "Yeni TODO Ekle",
        click() {
          createWindow();
        },
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
    label: "Gelistirici Araclari",
    submenu: [
      {
        label: "Gelistirici Araclari",
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
    width: 480,
    height: 211,
    title: "Yeni Bir Pencere",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  addWindow.setResizable(false);

  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "pages/newTodo.html"),
      protocol: "file",
      slashes: true,
    })
  );

  addWindow.on("close", () => {
    addWindow = null;
  });
}

function getTodoList() {
  console.log(todoList);
}
