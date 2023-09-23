import fs from "fs";
import { ProductManager } from "./ProductManager.js";

const productService = new ProductManager("../../src/data/productos.json");

export class CartManager {
  constructor(route) {
    this.path = route;
  }

  fileExists() {
    return fs.existsSync(this.path);
  }

  async readCarts() {
    try {
      if (this.fileExists) {
        const carts = await fs.promises.readFile(this.path, "utf-8");
        const cartsJson = JSON.parse(carts);
        return cartsJson;
      } else {
        return "El archivo no existe";
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async getCarts() {
    try {
      if (this.fileExists) {
        return this.readCarts();
      } else {
        return "El archivo no existe";
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async addCart(postCart) {
    const addCart = await this.readCarts();
    let newId = addCart.length ? addCart[addCart.length - 1].id + 1 : 1;
    const newCart = {
      id: newId,
      products: [postCart],
    };

    try {
      addCart.push(newCart);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(addCart, null, "\t")
      );
      return "Carrito Agregado";
    } catch (error) {
      return error.message;
    }
  }

  async getProductsInCart(CartId) {
    try {
      const getCartById = await this.readCarts();
      const getId = getCartById.find((CartsId) => {
        return CartsId.id === CartId;
      });
      if (getId == undefined) {
        return "El carrito no fue encontrado";
      } else {
        return getId;
      }
    } catch (error) {
      return error.message;
    }
  }

  async addProductsInCart(CartId, productId) {
    try {
      const getCartById = await this.readCarts();
      const cartIndex = getCartById.findIndex((cart) => cart.id === CartId);

      if (cartIndex === -1) {
        return "El carrito no fue encontrado";
      }

      const cart = getCartById[cartIndex];
      const productIndex = cart.products.findIndex(
        (product) => product.id === productId
      );

      if (productIndex === -1) {
        // El producto no existe en el carrito, agregamos uno nuevo
        cart.products.push({ id: productId, quantity: 1 });
      } else {
        // El producto ya existe en el carrito, incrementamos la cantidad
        cart.products[productIndex].quantity++;
      }

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(getCartById, null, "\t")
      );

      return "Producto agregado al carrito";
    } catch (error) {
      return error.message;
    }
  }
}
