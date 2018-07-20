const Bundler = require("parcel-bundler")
const Path = require("path")

const bundle = async () => {
    const file = Path.join(__dirname, "./source/index.html")

    const options = {
        outDir: "./build",
        outFile: "index.html",
        publicUrl: "./",
        watch: true,
        cache: true,
        cacheDir: "./cache",
        minify: false,
        target: "electron",
        https: false,
        logLevel: 3,
        hmrPort: 0,
        sourceMaps: true,
        hmrHostname: "",
        detailedReport: true,
    }

    const bundler = new Bundler(file, options)
    const bundle = await bundler.bundle()
}

bundle()