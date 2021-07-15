import express from "express";
import {ProductController} from "../controllers/product.controller";
import validator from "validator";
import isNumeric = validator.isNumeric;

const productRouter = express.Router()

productRouter.post("/", async function(req, res){
    const {
        name,
        description,
        serial_number,
        price,
        piece_of,
        entrepot_store_id
    } = req.body;

    if (
        name === undefined ||
        description === undefined
    ) {
        res.status(400).end();
        return;
    }

    const productController = await ProductController.getInstance();
    const product = await productController.create({
        name,
        description,
        serial_number,
        price,
        piece_of,
        entrepot_store_id
    });

    if (product != null){
        res.status(201);
        res.json(product);
    }else{
        res.status(409).end();
    }
});

productRouter.get("/", async function (req, res){
    const productController = await ProductController.getInstance();
    const product = await productController.getAll();

    if (product != null){
        res.status(200);
        res.json(product);
    }else{
        res.status(204).end();
    }
});

productRouter.get("/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const productController = await ProductController.getInstance();
    const product = await productController.getOne( Number.parseInt(id) );

    if (product != null){
        res.status(200);
        res.json(product);
    }else{
        res.status(204).end();
    }
});

productRouter.put("/", async function(req, res){
    const {
        id,
        name,
        description,
        serial_number,
        price,
        piece_of,
        entrepot_store_id
    } = req.body;

    if ( id === undefined ) {
        res.status(400).end();
        return;
    }

    const productController = await ProductController.getInstance();
    const product = await productController.update({
        id,
        name,
        description,
        serial_number,
        price,
        piece_of,
        entrepot_store_id
    });

    if (product != null){
        res.status(200);
        res.json(product);
    }else{
        res.status(400).end();
    }
});

productRouter.delete("/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const productController = await ProductController.getInstance();
    const affectedRows = await productController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    productRouter
}
