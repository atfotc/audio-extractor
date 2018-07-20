const { app, BrowserWindow } = require("electron")

const windowTitle = "Audio Extractor"
const windowMinWidth = 640
const windowMinHeight = 480

let window = null

function createWindow() {
    window = new BrowserWindow({
        title: windowTitle,
        minWidth: windowMinWidth,
        minHeight: windowMinHeight,
    })

    window.loadFile("./build/index.html")
}

app.on("ready", createWindow)

app.on("window-all-closed", e => {
    window = null

    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (window === null) {
        createWindow()
    }
})
