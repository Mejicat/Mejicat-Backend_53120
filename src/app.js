import express from "express"
import productRouter from "./router/product.routes.js"
import cartRouter from "./router/carts.routes.js"
import { engine } from "express-handlebars"
import * as path from "path"
import { __dirname } from "./utils.js"
import ProductManager from "./components/ProductManager.js"
import { Server } from "socket.io"
import exphbs from "express-handlebars"
import handlebars from "handlebars"


const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, () => {
    console.log(`Express por Local Host ${httpServer.address().port}`)
})
httpServer.on("error", (error) => console.error(`Error del servidor ${error}`))

const productsFinal = new ProductManager()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)

//Handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

// Registro el parcial para habilitar el chat
import fs from "fs";
const chatPartial = fs.readFileSync(path.resolve(__dirname, "views/chat.handlebars"), "utf-8")
handlebars.registerPartial('chat', chatPartial)

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

const message = []

// Socket.io
const socketServer = new Server(httpServer)
socketServer.on("connection", (socket) => {
    console.log("Nuevo cliente conectado -----> ", socket.id)

    // Nombre del usuario
    let userName = ""

    // Mensaje de conexión
    socket.on('userConnection',(data)=>{
      userName = data.user
      message.push({
        id: socket.id,
        name: data.user,
        message: `${data.user} conectado`,
        date: new Date().toTimeString(),
      })
      socketServer.sockets.emit("userConnection", message)
    })
    // Mensaje de "Mensaje enviado"
   /* socket.on('userMessage',(data)=>{
      message.push({
        id: socket.id,
        name: userName,
        message: data.message,
        date: new Date().toTimeString(),
      })
      socketServer.sockets.emit("userMessage", message)
    })
*/
socket.on('userMessage', (data) => {
  const messageData = {
      name: userName,
      message: data.message,
      date: new Date().toTimeString(),
  };
  
  // Emitir el mensaje de vuelta al cliente que lo envió
  /*socket.emit('userMessage', messageData)*/
  // Emitir el mensaje a todos los clientes (incluido el remitente)
  socketServer.emit('userMessage', messageData)
});





    // Mensaje de usuario escribiendo
    socket.on('typing',(data)=>{
      socket.broadcast.emit("typing", data)
      })

    socket.on("addProduct", async (newProduct) => {
        const addedProduct = await productsFinal.addProduct(newProduct)
        if (addedProduct === "Producto agregado") {
            const products = await productsFinal.getProducts()
            socketServer.emit("productAdded", addedProduct)
            socketServer.emit("receiveProducts", products)
        } else {
            socket.emit("error", addedProduct)
        }
    })

    socket.on("deleteProduct", async (productId) => {
        const deletedProduct = await productsFinal.deleteProduct(productId)
        if (deletedProduct === "Producto eliminado") {
            const products = await productsFinal.getProducts()
            socketServer.emit("productDeleted", productId)
            socketServer.emit("receiveProducts", products)
        } else {
            socket.emit("error", deletedProduct)
        }
    })

    socket.on("getProducts", async () => {
        const products = await productsFinal.getProducts()
        socket.emit("receiveProducts", products)
    })
})









