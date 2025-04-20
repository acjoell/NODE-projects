const { readFile } = require('node:fs/promises')

/* Lo mismo que el código de abajo, pero con una función normal

async function init () {
    console.log('Leyendo el primer archivo...');

    const text = await readFile('./intro.md', 'utf-8')
    console.log('El contenido del archivo es:');
    console.log(text);

    console.log('Haciendo cosas mientras se lee el archivo...');
}

init()
*/

// IIFE -> Inmediately Invoked Function Expression
// Se ejecuta inmediatamente
;(
  async () => {
    console.log('Leyendo el primer archivo...')

    const text = await readFile('./intro.md', 'utf-8')
    console.log('El contenido del archivo es:')
    console.log(text)

    console.log('Haciendo cosas mientras se lee el archivo...')
  }
)()

// ;( () => {} )()
