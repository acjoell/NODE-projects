const path = require('node:path')

// Barra separadora segun SO
console.log('El separador es: ', path.sep)

// unir rutas con path.join
const filePath = path.join('main', 'assets', '01.jpeg')
console.log(filePath)

// Devuelve el nombre del fichero
const base = path.basename('/tmp/base/topSecret/confidential.txt')
console.log(base)

const baseSimple = path.basename('/tmp/base/topSecret/confidential.txt', '.txt')
console.log(baseSimple)

const extension = path.extname('my.super.image.png')
console.log(extension)
