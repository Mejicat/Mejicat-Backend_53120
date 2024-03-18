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

//Handlebars
app.engine("handlebars",engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

//Static
app.use("/", express.static(__dirname + "/public", {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css')
        }
    }
}))

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Bienvenido a la juguetería online</title>
        <link rel="stylesheet" href="/css/style.css">
      </head>
      <body>
      <main>
        <h1>Agregar Productos</h1>
        <div>
          <br />
        </div>
       <div>
      <h3> En caso que desees agregar un producto, procede al siguiente formulario </h3>
      <button class="button" onclick="window.location.href='/realtimeproducts'">Agregar producto</button>
       </div>
      </main>
      <script src="/js/index.js"></script>
    </body>
      </body>
    </html>
  `)
})

// Dejo habilitada la consulta por ID
app.get("/:id", async(req,res) => {
    let product = await productsFinal.getProductsById(req.params.id)
    res.send (product)
    })

/*app.get("/realtimeproducts", async (req, res) => {
    res.render("/views/realtimeproducts", {
      style: "styles.css",
      layout: "products",
    })
  })*/

const socketServer = new Server(httpServer)
socketServer.on("connection", (socket) => {
    console.log("Nuevo cliente conectado -----> ", socket.id);
  
    socket.on("addProduct", async (newProduct) => {
      await productsFinal.addProduct(newProduct)
    })
  
    socket.on("deleteProductsById", async (productId) => {
      await productsFinal.deleteProductsById(productId)
    })
  
    socket.on("getProducts", async () => {
      const products = await productsFinal.getProducts()
      socket.emit("receiveProducts", products)
    })
})


app.use("/api/products",productRouter)
app.use("/api/cart",cartRouter)






