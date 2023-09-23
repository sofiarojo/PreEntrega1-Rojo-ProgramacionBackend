import express from "express";
import { cartsRouter } from "./routes/carts.routes.js";
import { productsRouter } from "./routes/products.routes.js";

const port = 8080;
const app = express();

app.use(express.json());
app.listen(port, () => console.log(`Server listening on port ${port}`));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
