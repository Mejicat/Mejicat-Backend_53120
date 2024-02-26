import {promises as fs} from "fs"
import { json } from "stream/consumers"

class ProductManager {
    constructor () {
        this.path = "./products.txt"
        this.products = []
    }

    static id = 0

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        ProductManager.id ++
        
        let newProduct = {
            title, 
            description, 
            price, 
            thumbnail, 
            code, 
            stock,
            id: ProductManager.id
        }

        this.products.push (newProduct)

        await fs.writeFile (this.path, JSON.stringify (this.products))
    }

    readProducts = async () => {
        let answer = await fs.readFile (this.path, "utf-8")
        return JSON.parse(answer)
    }
    
    getProducts = async () => {
        let answer2 = await this.readProducts()
        return console.log (answer2)
    } 

    getProductsById = async (id) => {
        let answer3 = await this.readProducts()
        if (!answer3.find (product => product.id === id)) {
            console.log ("Producto no encontrado")
        } else {
            console.log (answer3.find (product => product.id === id))
        }
    }

    deleteProductsById = async (id) => {
        let answer3 = await this.readProducts()
        let productFilter = answer3.filter(product => product.id ==! id)
        await fs.writeFile(this.path, JSON.stringify(productFilter))
        console.log ("Producto eliminado")
    }

    updateProducts = async ({id, ...product}) => {
        await this.deleteProductsById(id)
        let oldProduct = await this.readProducts ()
        let productsModified = [
            {...product, id},
            ...oldProduct
        ]
        await fs.writeFile (this.path, JSON.stringify (productsModified))
    }
}

const productsFinal = new ProductManager

// TEST PARA CORROBORAR QUE SE AGREGAN PRODUCTOS AL ARRAY
//productsFinal.addProduct ("Monster Jam","Monster Mutt",12300,"imagen1","MNJ5050",10)
//productsFinal.addProduct("Monster Jam","Northern Nightmare",12300,"imagen2","MNJ5051",2)
//productsFinal.getProducts()

// TEST SOBRE BÚSQUEDA POR ID
//productsFinal.getProductsById(2)

// TEST SOBRE PRODUCT NO ENCONTRADO
//productsFinal.getProductsById(4)

// TEST SOBRE EL MÉTODO DE ELIMINAR PRODUCT BY ID
//productsFinal.deleteProductsById (2)

// TEST SOBRE LA FUNCIONALIDAD DE HACER UN UPDATE SOBRE UNA VARIABLE DEL PRODUCTO (ejemplo: price)
/*productsFinal.updateProducts ({
    title: 'Monster Jam',
    description: 'Monster Mutt',
    price: 15000,
    thumbnail: 'imagen1',
    code: 'MNJ5050',
    stock: 10,
    id: 1
})*/