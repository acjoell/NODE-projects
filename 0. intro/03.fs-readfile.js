const fs = require('node:fs')

// Esto solo en los modulos nativos que no tienen promesas nativas
// const { promisify } = require('node:util');
// const readFilePromise = promisify(fs.readFile);

/*
fs.readFilePromise('./introd.md', 'utf-8')
    .then(data => {
        console.log('El contenido del archivo es:');
        console.log(data);
    })
    .catch(err => {
        console.error('Error al leer el archivo:', err);
    })
*/

console.log('Leyendo el primer archivo...')
fs.readFile('./introd.md', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err)
  } else {
    console.log('Contenido del archivo:', data)
  }
})

console.log('Haciendo cosas mientras se lee el archivo...')
