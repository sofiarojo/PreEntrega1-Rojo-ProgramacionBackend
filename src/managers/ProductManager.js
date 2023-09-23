import fs from "fs";

export class ProductManager {
  constructor(route) {
    this.path = route;
  }

  fileExists() {
    return fs.existsSync(this.path);
  }

  async readProducts() {
    try {
      if (this.fileExists) {
        const products = await fs.promises.readFile(this.path, "utf-8");
        const productsJson = JSON.parse(products);
        return productsJson;
      } else {
        return "El archivo no existe";
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async getProducts() {
    try {
      if (this.fileExists) {
        return this.readProducts();
      } else {
        return "El archivo no existe";
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async addProduct(
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
    status
  ) {
    if (
      title == null ||
      description == null ||
      price == null ||
      thumbnail == null ||
      code == null ||
      stock == null ||
      category == null
    ) {
      return "Por favor, revisar todos los campos";
    } else {
      const addProduct = await this.readProducts();
      let newId = addProduct.length
        ? addProduct[addProduct.length - 1].id + 1
        : 1;
      const newProduct = {
        id: newId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status: true,
      };

      try {
        if (this.fileExists()) {
          const getCode = addProduct.some((codes) => {
            return codes.code === newProduct.code;
          });
          if (getCode == true) {
            return "Este producto ya existe";
          } else {
            addProduct.push(newProduct);
            await fs.promises.writeFile(
              this.path,
              JSON.stringify(addProduct, null, "\t")
            );
            return "Producto Agregado";
          }
        } else {
          console.log("El archivo no existe");
          await fs.promises.writeFile(
            this.path,
            JSON.stringify([newProduct], null, "\t")
          );
          console.log("Producto Agregado");
        }
      } catch (error) {
        return error.message;
      }
    }
  }

  async getProductById(idProducto) {
    try {
      const getProductById = await this.readProducts();
      const getId = getProductById.find((idProductos) => {
        return idProductos.id === idProducto;
      });
      if (getId == undefined) {
        return "El producto no fue encontrado";
      } else {
        return getId;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateProduct(idProducto, data) {
    try {
      const getProductById = await this.readProducts();
      const getId = getProductById.find((idProductos) => {
        return idProductos.id === idProducto;
      });
      for (let prop in data) {
        getId[prop] = data[prop];
      }
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(getProductById, null, "\t")
      );
    } catch (err) {
      return "updateProduct: error", err;
    }
  }

  async deleteProduct(idProducto) {
    try {
      const deleteProduct = await this.readProducts();
      const getId = deleteProduct.find((idProductos) => {
        return idProductos.id === idProducto;
      });
      if (getId == undefined) {
        console.log("El producto no fue encontrado");
      }
      if (getId == 1) {
        deleteProduct.splice(idProducto, 1);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(deleteProduct, null, "\t")
        );
        console.log("productsJson: ", deleteProduct);
        // deleteProduct.forEach((element) => {
        //     if(element.id > id){
        //         element.id -= 1
        //     }
        // });
      } else {
        deleteProduct.splice(idProducto - 1, 1);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(deleteProduct, null, "\t")
        );
        console.log("productsJson: ", deleteProduct);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}
