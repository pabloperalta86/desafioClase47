import { Context, helpers, MongoClient, ObjectId, config } from "../depts.ts";
import { Product } from "../types/product.ts";

const {MONGO_URL, MONGO_DB_NAME} = config();

//conexion de la base de datos
const client = new MongoClient();
try {
    await client.connect(MONGO_URL);
    console.log("base de datos conectada");
} catch (error) {
    console.log(error.message);
}

const db = client.database(MONGO_DB_NAME); //Crear una instancia de la base de datos
const productModel = db.collection<Product>("products"); //creamos el modelo de los usuarios

export const getAllProducts = async(ctx: Context)=>{
    try {
        const products = await productModel.find().toArray();
        ctx.response.status = 200;
        ctx.response.body = {status:"success", data:products}
    } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = {status:"error", message:error.message}
    }
};

export const getProduct = async(ctx: Context)=>{
    try {
    const {uid} = helpers.getQuery(ctx,{mergeParams:true}); //req.params
    const product = await productModel.findOne({_id:new ObjectId(uid)});
    if(product){
        ctx.response.body = {status:"success", data: product}
    } else {
        ctx.response.body = {status:"error", message:"el producto no existe"}
    }
    } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = {status:"error", message:error.message}
    }
};

export const createProduct = async(ctx:Context)=>{
    try {
        const reqBody = await ctx.request.body().value; //req.body
        const newProduct = {
            title:reqBody.get("title"),
            price:reqBody.get("price"),
            thumbnail:reqBody.get("thumbnail")
        }
        const productCreated = await productModel.insertOne(newProduct);
        ctx.response.body = {status:"success", data:productCreated};
    } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = {status:"error", message:error.message}
    }
};

export const updateProduct = async(ctx: Context)=>{
    try {
    const {uid} = helpers.getQuery(ctx,{mergeParams:true}); //req.params
    const reqBody = await ctx.request.body().value; //req.body
    const updateProduct = {
        title:reqBody.get("title"),
        price:reqBody.get("price"),
        thumbnail:reqBody.get("thumbnail")
    }
    const product = await productModel.updateOne({_id:new ObjectId(uid)}, {$set: updateProduct});
    if(product){
        ctx.response.body = {status:"success", data: product}
    } else {
        ctx.response.body = {status:"error", message:"el producto no existe"}
    }
    } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = {status:"error", message:error.message}
    }
};

export const deleteProduct = async(ctx: Context)=>{
    try {
    const {uid} = helpers.getQuery(ctx,{mergeParams:true}); //req.params
    const product = await productModel.deleteOne({_id:new ObjectId(uid)});
    if(product){
        ctx.response.body = {status:"success", data: product}
    } else {
        ctx.response.body = {status:"error", message:"el producto no existe"}
    }
    } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = {status:"error", message:error.message}
    }
};