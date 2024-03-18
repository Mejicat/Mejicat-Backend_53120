import { Router } from "express"
import ProductManager from "../components/ProductManager.js"

const productRouter = Router ()

const productsFinal = new ProductManager()

productRouter.get("/", async (req, res) => {
    let limit = +req.query.limit
    const products = await productsFinal.getProducts(limit)
    res.render("home", {
      style: "styles.css",
      products: products,
      layout: "products",
    })
  })

productRouter.get ("/:id", async (req, res) => {
    let id = parseInt(req.params.id)
    let allProducts = await productsFinal.readProducts()
    let productById = allProducts.find (product => product.id === id)
    res.json (productById)
})

productRouter.post("/", async (req,res) => {
    let newProduct = req.body
    res.json (await productsFinal.addProduct (newProduct))
})

productRouter.put("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    let updateProducts = req.body
    res.json (await productsFinal.updateProducts(id,updateProducts))
})

productRouter.delete ("/:id", async (req, res) => {
    let id = req.params.id
    res.json (await productsFinal.deleteProduct(id))
})

export default productRouter