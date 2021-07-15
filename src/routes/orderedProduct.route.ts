import express from "express";
import {OrderedProductController} from "../controllers/orderedProduct.controller";
import validator from "validator";
import isNumeric = validator.isNumeric;

const orderedProductRouter = express.Router();

orderedProductRouter.post("/", async function (req, res){
    const {ordered_id, product_id} = req.body;
    if ( ordered_id === undefined || product_id === undefined){
        res.status(400).end();
        return;
    }

    const orderedProductController = await OrderedProductController.getInstance();
    const orderedProduct = await orderedProductController.create({
        ordered_id,
        product_id
    });

    if (orderedProduct != null){
        res.status(201);
        res.json(orderedProduct)
    }else{
        res.status(409).end();
    }
});

orderedProductRouter.get("/all", async function(req, res){
    const orderedProductController = await OrderedProductController.getInstance();
    const orderedProduct = await orderedProductController.getAll();

    if (orderedProduct != null){
        res.status(200);
        res.json(orderedProduct);
    }else{
        res.status(204).end();
    }
});

orderedProductRouter.get("/all/:ordered_id", async function(req, res){
    const {ordered_id} = req.params;

    if (!isNumeric(ordered_id)){
        res.status(409).end();
        return;
    }

    const orderedProductController = await OrderedProductController.getInstance();
    const orderedProduct = await orderedProductController.getAllByOrdered( Number.parseInt(ordered_id) );

    if (orderedProduct != null){
        res.status(200);
        res.json(orderedProduct);
    }else{
        res.status(204).end();
    }
})

orderedProductRouter.get("/one/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const orderedProductController = await OrderedProductController.getInstance();
    const orderedProduct = await orderedProductController.getOneById( Number.parseInt(id) );

    if (orderedProduct != null){
        res.status(200);
        res.json(orderedProduct);
    }else{
        res.status(204).end();
    }
});

orderedProductRouter.get("/one/:ordered_id/:product_id", async function(req, res){
    const {ordered_id, product_id} = req.params;
    if (!isNumeric(ordered_id) || !isNumeric(product_id)){
        res.status(409).end();
        return;
    }

    const orderedProductController = await OrderedProductController.getInstance();
    const orderedProduct = await orderedProductController.getOneByProps(
        Number.parseInt(ordered_id),
        Number.parseInt(product_id)
    );

    if (orderedProduct != null){
        res.status(200);
        res.json(orderedProduct);
    }else{
        res.status(204).end();
    }
});

orderedProductRouter.put("/", async function (req, res){
    const {id, ordered_id, product_id} = req.body;
    if (id === undefined || ordered_id === undefined || product_id === undefined){
        res.status(400).end();
        return;
    }

    const orderedProductController = await OrderedProductController.getInstance();
    const orderedProduct = await orderedProductController.update({
        id,
        ordered_id,
        product_id
    });

    if (orderedProduct != null){
        res.status(201);
        res.json(orderedProduct)
    }else{
        res.status(409).end();
    }
});

orderedProductRouter.delete("/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const orderedProductController = await OrderedProductController.getInstance();
    const affectedRows = await orderedProductController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    orderedProductRouter
}
