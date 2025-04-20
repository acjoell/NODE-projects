// process
// argumentos de entrada

console.log(process.argv)

// Devuelve:
// [
//   '/usr/local/bin/node',
//   '/home/acjoell/Documentos
//   ...
// ]

// Controlar el proceso y su salida
// console.log('Sale sin errores')
// process.exit(0)

// console.log('Sale con errores')
// process.exit(1)

// Controlar eventos del proceso
process.on('exit', (code) => {
    console.log(`El proceso terminó con el código: ${code}`)
    }
)

// Currenct Working Directory
console.log(process.cwd())


console.log(process.env.NODE_ENV)