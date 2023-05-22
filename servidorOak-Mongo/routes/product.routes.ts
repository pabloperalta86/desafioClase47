import {Router} from "../depts.ts";
import { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../handlers/products.handler.ts";

export const productsRouter = new Router()
.get("/products", getAllProducts)
.get("/products/:uid", getProduct)
.post("/products", createProduct)
.put("/products/:uid", updateProduct)
.delete("/products/:uid", deleteProduct)