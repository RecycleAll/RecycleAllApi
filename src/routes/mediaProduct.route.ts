import express from "express";
import {MediaProductController} from "../controllers/mediaProduct.controller";
import validator from "validator";
import isNumeric = validator.isNumeric;

const mediaProductRouter = express.Router();

mediaProductRouter.post("/", async function (req, res){
    const {media_id, product_id} = req.body;
    if ( media_id === undefined || product_id === undefined){
        res.status(400).end();
        return;
    }

    const mediaProductController = await MediaProductController.getInstance();
    const mediaProduct = await mediaProductController.create({
        media_id,
        product_id
    });

    if (mediaProduct != null){
        res.status(201);
        res.json(mediaProduct)
    }else{
        res.status(409).end();
    }
});

mediaProductRouter.get("/all", async function(req, res){
    const mediaProductController = await MediaProductController.getInstance();
    const mediaProduct = await mediaProductController.getAll();

    if (mediaProduct != null){
        res.status(200);
        res.json(mediaProduct);
    }else{
        res.status(204).end();
    }
});

mediaProductRouter.get("/all/:product_id", async function(req, res){
    const {product_id} = req.params;

    if (!isNumeric(product_id)){
        res.status(409).end();
        return;
    }

    const mediaProductController = await MediaProductController.getInstance();
    const mediaProduct = await mediaProductController.getAllByProduct( Number.parseInt(product_id) );

    if (mediaProduct != null){
        res.status(200);
        res.json(mediaProduct);
    }else{
        res.status(204).end();
    }
})

mediaProductRouter.get("/one/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const mediaProductController = await MediaProductController.getInstance();
    const mediaProduct = await mediaProductController.getOneById( Number.parseInt(id) );

    if (mediaProduct != null){
        res.status(200);
        res.json(mediaProduct);
    }else{
        res.status(204).end();
    }
});

mediaProductRouter.get("/one/:media_id/:product_id", async function(req, res){
    const {media_id, product_id} = req.params;
    if (!isNumeric(media_id) || !isNumeric(product_id)){
        res.status(409).end();
        return;
    }

    const mediaProductController = await MediaProductController.getInstance();
    const mediaProduct = await mediaProductController.getOneByProps(
        Number.parseInt(media_id),
        Number.parseInt(product_id)
    );

    if (mediaProduct != null){
        res.status(200);
        res.json(mediaProduct);
    }else{
        res.status(204).end();
    }
});

mediaProductRouter.put("/", async function (req, res){
    const {id, media_id, product_id} = req.body;
    if (id === undefined || media_id === undefined || product_id === undefined){
        res.status(400).end();
        return;
    }

    const mediaProductController = await MediaProductController.getInstance();
    const mediaProduct = await mediaProductController.update({
        id,
        media_id,
        product_id
    });

    if (mediaProduct != null){
        res.status(201);
        res.json(mediaProduct)
    }else{
        res.status(409).end();
    }
});

mediaProductRouter.delete("/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const mediaProductController = await MediaProductController.getInstance();
    const affectedRows = await mediaProductController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    mediaProductRouter
}
