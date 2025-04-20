import { readFile } from 'node:fs/promises'

console.log('Leyendo el primer archivo...')

const text = await readFile('./intro.md', 'utf-8')
console.log('El contenido del archivo es:')
console.log(text)

console.log('Haciendo cosas mientras se lee el archivo...')
