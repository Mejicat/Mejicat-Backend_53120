import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)


// Revisar por qué este esquema no funciona
//import path from "path"
//import { fileURLToPath } from "url"

//const __filename = fileURLToPath(import.meta.url)
//const __dirname = path.dirname(__filename)

//console.log(__dirname) --> compruebo que llego a /Users/lucas.gatto/Desktop/53120/src

//export default __dirname