import express from "express"
import productRouter from "./router/product.routes.js"
import cartRouter from "./router/carts.routes.js"
import { engine } from "express-handlebars"
import * as path from "path"
import { __dirname } from "./utils.js"
import ProductManager from "./components/ProductManager.js"
import { Server } from "socket.io"

const app = express ()
const PORT = 8080
const httpServer = app.listen(PORT, () => {
    console.log (`Express por Local Host ${httpServer.address().port}`)
})
httpServer.on("error", (error) => console.error (`Error del servidor ${error}`))

const productsFinal = new ProductManager()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api/products",productRouter)
app.use("/api/cart",cartRouter)

//Handlebars
app.engine("handlebars",engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

//Static
app.use("/", express.static(__dirname + "/public"))

//Rutas
app.get("/", (req, res) => {
  res.render("home", {
    style: "styles.css",
    layout: "products",
  })
})

app.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts", {
      style: "styles.css",
      layout: "products",
    })
  })

// Socket.io
const socketServer = new Server(httpServer)
socketServer.on("connection", (socket) => {
    console.log("Nuevo cliente conectado -----> ", socket.id);
  
    socket.on("addProduct", async (newProduct) => {
      await productsFinal.addProduct(newProduct)
    })

    socket.on("deleteProduct", async (productId) => {
      await productsFinal.deleteProduct(productId)
    })
  
    socket.on("getProducts", async () => {
      const products = await productsFinal.getProducts()
      socket.emit("receiveProducts", products)
    })
})









