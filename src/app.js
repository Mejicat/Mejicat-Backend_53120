import express from "express"
import productRouter from "./router/product.routes.js"
import cartRouter from "./router/carts.routes.js"

const app = express ()
const PORT = 8080
const server = app.listen(PORT, () => {
    console.log (`Express por Local Host ${server.address().port}`)
})
server.on("error", (error) => console.error (`Error del servidor ${error}`))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api/products",productRouter)
app.use("/api/cart",cartRouter)






