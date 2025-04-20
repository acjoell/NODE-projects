const fs = require('node:fs/promises')
const path = require('node:path')
const pc = require('picocolors')

// Tenemos el primer argumento que pasemos
const folder = process.argv[2] ?? '.'
// node filename.js ./assets

async function ls (directory) {
  // Using promises
  let files
  // asincronia secuencial (hasta no tener el directorio no sigue)
  try {
    files = await fs.readdir(folder)
  } catch (err) {
    console.error(pc.red(`❌ Error reading directory: ${directory}`))
    process.exit(1)
  }

  // funcion que ejecuta esto paralelamente
  const filePromises = files.map(async file => {
    const filePath = path.join(folder, file)
    let stats

    try {
      stats = await fs.stat(filePath) // stat da la info del archivo
    } catch {
      console.error(`Error reading archive: ${filePath}`)
    }

    const isDirectory = stats.isDirectory()
    const fileType = isDirectory ? 'd' : 'f'
    const fileSize = stats.size.toString()
    const fileModified = stats.mtime.toLocaleString()

    return `${fileType} ${pc.green(file.padEnd(30))} ${pc.blue(fileSize.padStart(10))} ${fileModified}`
  })
  const filesInfo = await Promise.all(filePromises)

  filesInfo.forEach(file => { console.log(file) })
}

ls(folder)
