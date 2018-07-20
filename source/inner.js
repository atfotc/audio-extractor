import { remote }  from "electron"
import path from "path"
import ffbinaries  from "ffbinaries"
import ffmpeg from "fluent-ffmpeg"

const dataPath = remote.app.getPath("appData")

const $files = document.querySelector(".files")
const $downloadingBinaries = document.querySelector(".downloading-binaries")
const $dropFiles = document.querySelector(".drop-files")

const showItem = message => {
    const $item = document.createElement("li")
    $item.innerText = message
    $item.className = "file"

    $files.appendChild($item)

    return $item
}

const hideItem = $item => {
    $item.classList.add("disappear")

    setTimeout(() => {
        $files.removeChild($item)
    }, 1000)
}

$downloadingBinaries.style.opacity = "1"

ffbinaries.downloadBinaries(['ffmpeg'], { destination: dataPath }, () => {
    $downloadingBinaries.style.opacity = "0"
})

window.addEventListener("dragover", e => {
    e.preventDefault()
    e.stopPropagation()

    $dropFiles.style.opacity = "1"
})

window.addEventListener("dragleave", e => {
    e.preventDefault()
    e.stopPropagation()

    $dropFiles.style.opacity = "0"
})

window.addEventListener("dragend", e => {
    e.preventDefault()
    e.stopPropagation()

    $dropFiles.style.opacity = "0"
})

window.addEventListener("drop", e => {
    e.preventDefault()
    e.stopPropagation()

    $dropFiles.style.opacity = "0"

    Array.from(e.dataTransfer.files).forEach(file => {
        if (file.type !== "video/quicktime") {
            const $item = showItem(`${file.name} is the wrong type of file`)
            setTimeout(() => hideItem($item), 3000)
        } else {
            remote.dialog.showSaveDialog({
                "title": `Save audio from ${file.name}`,
                "message": `Save audio from ${file.name}`,
                "showsTagField": false,
                "filters": [
                    {"name": "Audio", "extensions": ["mp3"]},
                ],
            }, output => {
                if (typeof output == "undefined") {
                    const $item = showItem(`${file.name} extraction cancelled`)
                    setTimeout(() => hideItem($item), 3000)
                    return
                }

                const ffmpegPath = path.join(dataPath, "ffmpeg")

                const $item = showItem(`Extracting audio from ${file.name}`)

                ffmpeg(file.path)
                    .setFfmpegPath(ffmpegPath)
                    .on("progress", info => {
                        if (info.progress) {
                            $item.innerText = `Extracting audio from ${file.name} ⇒ ${info.percent}`
                        }
                    })
                    .on("end", () => {
                        $item.innerText = `Done with ${output}`
                        setTimeout(() => hideItem($item), 3000)
                    })
                    .format("mp3")
                    .save(output)
            })
        }
    })
})
