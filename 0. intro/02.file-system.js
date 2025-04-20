const fs = require("node:fs")

const stats = fs.statSync("./01.os-info.js")
console.log(
  stats.isFile() ? "Es un archivo" : "No es un archivo",
  stats.isDirectory(),
  stats.isSymbolicLink(),
  stats.size
)
