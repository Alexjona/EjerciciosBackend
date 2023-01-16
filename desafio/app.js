import express from 'express';
import  ProductManager from './ProductManagerdesafio2.js';
const server = express();

server.get('/products', async (req,res)=>{
    const pm = new ProductManager();
    let productos = await pm.getProducts();
    const limite = req.query.limit
    if (limite<productos.length){
        productos=productos.slice(0,limite)
    }
    res.send({"products":productos})
})

server.get('/products/:pid', async (req,res)=>{
    const pm = new ProductManager();
    const id = parseInt (req.params.identificador)
    let producto = await pm.getProductById(id);
    // if (id===producto.length){
    //     producto=producto.slice(0,id)
    // }
    res.send({"products":producto})
})

server.listen(8080,()=>{
    console.log("Servidor Escuchando en el puerto 8080")
})