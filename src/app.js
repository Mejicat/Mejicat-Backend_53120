import express from "express"
import productRouter from "./router/product.routes.js"
import cartRouter from "./router/carts.routes.js"
import { engine } from "express-handlebars"
import * as path from "path"
import __dirname from "./utils.js"
import ProductManager from "./components/ProductManager.js"

const app = express ()
const PORT = 8080
const server = app.listen(PORT, () => {
    console.log (`Express por Local Host ${server.address().port}`)
})
server.on("error", (error) => console.error (`Error del servidor ${error}`))

const productsFinal = new ProductManager()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Handlebars
app.engine("handlebars",engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

//Static
app.use("/", express.static(__dirname + "/public"))

app.get("/", async(req,res) => {
    let allProducts = await productsFinal.getProducts()
    res.render ("home",{
        title : "Express | Handlebars",
        products : allProducts
    })
})

app.get("/:id", async(req,res) => {
    let product = await productsFinal.getProductsById(req.params.id)
    res.render ("prod",{
        title : "Express | Handlebars",
        products : product
    })
})

app.use("/api/products",productRouter)
app.use("/api/cart",cartRouter)






