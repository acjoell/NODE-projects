import { readFile } from 'node:fs/promises';

Promise.all([
    readFile('./intro.md', 'utf-8')
]).then(([text]) => {
    console.log('Leyendo el primer archivo...');

    console.log('El contenido del archivo es:');
    console.log(text);

    console.log('Haciendo cosas mientras se lee el archivo...');
})