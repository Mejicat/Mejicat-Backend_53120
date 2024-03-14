import { Router } from "express"
import CartManager from "../components/CartManager.js"

const cartRouter = Router()
const carts = new CartManager

cartRouter.post("/", async (req,res) => {
    res.json(await carts.addCarts())
})

cartRouter.get("/", async (req,res) => {
    res.json(await carts.readCarts())
})

cartRouter.get("/:id", async (req,res) => {
    res.json(await carts.getCartsById(req.params.id))
})

cartRouter.post("/:cid/products/:pid", async (req,res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    res.json(await carts.addProductInCart(cartId,productId))
})

export default cartRouter