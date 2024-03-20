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

/*app.use("/", express.static(__dirname + "/public", {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css')
        }
    }
}))*/


/*app.get("/", async (req, res) => {
  let allProducts = await productsFinal.getProducts()
  res.render ("index", {
    title: "Express|Handlebars",
    products: allProducts,
    styleRoute:  '<link rel="stylesheet" href="css/{{style}}" />'
  })
})*/

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Bienvenido a la juguetería online</title>
        <style>
          body {
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            background-color: azure;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
          }
          p {
            color: #666;
          }
          .button {
            background-color: darkcyan;
            color: #fff;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-top: 10px;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          }
          button:hover {
            background-color: rgb(10, 3, 3);
            color: white;
          }
        </style>
      </head>
      <body>
      <main>
        <h1>Agregar Productos</h1>
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


app.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts", {
      style: "styles.css",
      layout: "products",
    })
  })

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









