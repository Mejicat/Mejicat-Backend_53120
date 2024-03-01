class ProductManager {
    constructor () {
        this.products = []
    }

    static id = 0

    addProduct (title, description, price, thumbnail, code, stock) {
        let newProduct
    // Verifico si el código ya existe en algún producto
        if (this.products.some(producto => producto.code === code)) {
            console.error(`Código ${code} repetido`)
        } else {
            newProduct = {
                title, description, price, thumbnail, code, stock
            }
        }

    // Verifico si todos los campos tienen valores
    if (newProduct && Object.values(newProduct).every(value => value !== undefined && value !== null)) {
        ProductManager.id++
        this.products.push({
            ...newProduct,
            id: ProductManager.id
        })
    } else {
        console.error("Todos los campos son requeridos")
    }
}
        
    getProducts () {
        return this.products
    } 
    
    exist(id) {
        return this.products.find((producto) => producto.id === id )
    }

    getProductById (id) {
        !this.exist(id) ? console.error ("Not Found") : console.log (this.exist(id))
    }
    
}

const products = new ProductManager
// Primera llamada --> arreglo vacío
//console.log(products.getProducts())

// Agregamos productos
//products.addProduct("Monster Jam","Monster Mutt",12300,"imagen1","MNJ5050",10)
//products.addProduct("Monster Jam","Northern Nightmare",12300,"imagen2","MNJ5051",2)

// Segunda llamada --> arreglo con productos
//console.log(products.getProducts())

// Validación de CODE repetido
//products.addProduct("Monster Jam","Ranger Rescue",12300,"imagen3","MNJ5051",5)

// Búsqueda de producto por Id
//products.getProductById(2)

// Búsqueda de producto por Id no encontrado
//products.getProductById(5)