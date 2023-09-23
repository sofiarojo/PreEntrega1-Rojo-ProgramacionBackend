import { Router } from "express";
import { ProductManager } from "../managers/ProductManager.js";

const router = Router();
const productService = new ProductManager("../src/data/productos.json");

//Endpoint para obtener todos los productos con límite opcional
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const getProducts = await productService.getProducts();

    if (limit) {
      const limitedProducts = getProducts.slice(0, parseInt(limit));
      res.json(limitedProducts);
    } else {
      res.json(getProducts);
    }
  } catch (error) {
    res.json(error.message);
  }
});

//Endpoint para obtener un producto por ID
router.get("/:productId", async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const getProductById = await productService.getProductById(productId);
    getProductById
      ? res.json(getProductById)
      : res.json("El producto buscado no fue encontrado");
  } catch (error) {
    res.json(error.message);
  }
});

//Endpoint para agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
    } = req.body;
    await productService.addProduct({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
    });
    if (
      title == null ||
      description == null ||
      price == null ||
      thumbnail == null ||
      code == null ||
      stock == null ||
      category == null
    ) {
      res.json({ message: "Por favor, revisar todos los campos" });
    } else {
      res.json({ message: "Producto Agregado" });
    }
  } catch (error) {
    res.json(error.message);
  }
});

//Endpoint para modificar un producto ya existente
router.put("/:productId", async (req, res) => {
  try {
    const updateProduct = req.body;
    const productId = parseInt(req.params.productId);
    await productService.updateProduct(productId, updateProduct);
    res.json({ message: "Producto modificado" });
  } catch (error) {
    res.json(error.message);
  }
});

//Endpoint para eliminar un producto
router.delete("/:productId", async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    await productService.deleteProduct(productId);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.json(error.message);
  }
});

export { router as productsRouter };
