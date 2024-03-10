import {promises as fs, writeFile} from "fs"
import { json } from "stream/consumers"

export default class ProductManager {
    constructor () {
        this.path = "./products.json"
        this.products = []
        this.id = 0
    }

    static id = 0

    readProducts = async () => {
        let answerReadProducts = await fs.readFile (this.path, "utf-8")
        return JSON.parse(answerReadProducts)
    }

    writeProducts = async (product) => {
        await fs.writeFile (this.path, JSON.stringify(product))
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        this.id ++
        
        let newProduct = {
            title, 
            description, 
            price, 
            thumbnail, 
            code, 
            stock,
            id: this.id
        }

        let currentProducts = await this.readProducts()
        let productALL = [... currentProducts, newProduct]
        await this.writeProducts (productALL)
        return "Producto agregado"
    }

    exist = async (id) => {
        let products = await this.readProducts()
        return products.find (prod => prod.id == id)
    }
    
    getProducts = async () => {
        let productsResults = await this.readProducts()
        return console.log (productsResults)
    } 

    getProductsById = async (id) => {
        let productById = await this.exist(id)
        if (!productById) return "Producto no encontrado"
        return productById
    }
    
    deleteProductsById = async (id) => {
        let productsFounded = await this.readProducts()
        let productFilter = productsFounded.some(product => product.id === id)
        if (productFilter) {
            let filteredProducts = productsFounded.filter(product => product.id != id)
            await fs.writeFile(this.path, JSON.stringify(filteredProducts))
            return "Producto eliminado"
        }
        return "El producto a eliminar es inexistente"
    }

    updateProducts = async ({id, ...product}) => {
        let productById = await this.exist(id)
        if (!productById) return "Producto no encontrado"
        await this.deleteProductsById(id)
        let oldProduct = await this.readProducts ()
        let products = [{...product, id:id}, ...oldProduct]
        await this.writeProducts (products)
        return "Producto actualizado"
    }
}

//const productsFinal = new ProductManager()
/* TEST PARA CORROBORAR QUE SE AGREGAN PRODUCTOS AL ARRAY
productsFinal.addProduct ("Monster Jam","Monster Mutt",12400,"imagen1","MNJ5050",10)
productsFinal.addProduct("Monster Jam","Northern Nightmare",12400,"imagen2","MNJ5051",25)
productsFinal.addProduct("Monster Jam","Grave Digger",12400,"imagen3","MNJ5052",25)
productsFinal.addProduct("Monster Jam","Lucas Stabilizer",12400,"imagen4","MNJ5053",20)
productsFinal.addProduct("Monster Jam","Backwards Bob",12400,"imagen5","MNJ5054",15)
productsFinal.addProduct("Monster Jam","El Toro Loco",12400,"imagen6","MNJ5055",10)
productsFinal.addProduct("Monster Jam","Soldier Fortune",12400,"imagen7","MNJ5056",10)
productsFinal.addProduct("Monster Jam","Earth Shaker",12400,"imagen8","MNJ5057",20)
productsFinal.addProduct("Monster Jam","Megalodon",12400,"imagen9","MNJ5058",25)
productsFinal.addProduct("Monster Jam","Glaze Machine",12400,"imagen10","MNJ5059",20)
/*

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