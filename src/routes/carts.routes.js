import { Router } from "express";
import { CartManager } from "../managers/CartManager.js";

const router = Router();
const cartService = new CartManager("../src/data/carritos.json");

router.post("/", async (req, res) => {
  try {
    const postCart = req.body;
    await cartService.addCart(postCart);
    res.json({ message: "Carrito Agregado" });
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/:cartId", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cartId);
    const getCartById = await cartService.getProductsInCart(cartId);
    getCartById
      ? res.json(getCartById)
      : res.json("El carrito buscado no fue encontrado");
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/:cartId/product/:productId", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cartId);
    const productId = parseInt(req.params.productId);
    const addProductsInCart = await cartService.addProductsInCart(
      cartId,
      productId
    );
    addProductsInCart
      ? res.json(addProductsInCart)
      : res.json("El carrito buscado no fue encontrado");
  } catch (error) {
    res.json(error.message);
  }
});

export { router as cartsRouter };
