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
                role: "toggleDevTools",
                accelerator: "F12"
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

module.exports = {template}