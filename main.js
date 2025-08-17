const { app, BrowserWindow, screen, Menu, shell } = require('electron')

function createMainWindow() {
  // Obtém as dimensões do monitor primário
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const win = new BrowserWindow({
    x: 0,  // Posição X no canto esquerdo
    y: 0,  // Posição Y no topo
    width,  // Largura igual à área útil do monitor
    height, // Altura igual à área útil do monitor
    icon: './src/public/img/icon-paymate.png', // Adicionar icone,
    maximizable: true,  // Permite maximizar
    fullscreenable: false,  // Desativa o fullscreen tradicional
    autoHideMenuBar: true,  // Opcional: esconde a barra de menu

  })
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  win.loadFile('./src/views/index.html')
}

app.whenReady().then(createMainWindow)
app.on("window-all-closed", () => {
  if (process.platform !== 'darwin') app.quit()
})

const template = [
  {
    label: "Arquivo",
    submenu: [{
      label: 'Sair',
      click: () => app.quit(),
      accelerator: 'Alt+F4'
    }]  
  },
  {
    label: "Exibir",
    submenu: [
      {
        label: "Recarregar",
        role: "reload"
      },
      {
        label: "Ferramentas do desenvolvedor",
        role: "toggleDevTools"
      },{type: "separator"},
      {
        label: "Zoom +",
        role: "zoomIn"
      },
      {
        label: "Zoom -",
        role: "zoomOut"
      },
      {
        label: "Restaurar zoom",
        role: "resetZoom"
      }
    ]
  },
  {
    label: "Ajuda",
    submenu: [
      {
        label: "docs",
        click: () => shell.openExternal("https://www.electronjs.org/pt/docs/latest/")
      },{type: "separator"},
      {
        label: "Desenvolvedores",
        submenu: [
          {
            label: "Front-End",
            click: () => shell.openExternal("https://www.linkedin.com/in/wagnermarinho/")
          },
          {
            label: "Back-End",
            click: () => shell.openExternal("https://www.linkedin.com/in/carlos-kauan-brito-monteiro/")
          },
        ] 
      }
    ]
  }
]