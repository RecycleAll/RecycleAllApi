import express from "express";
import {DonProductController} from "../controllers/donProduct.controller";
import validator from "validator";
import isNumeric = validator.isNumeric;

const donProductRouter = express.Router();

donProductRouter.post("/", async function (req, res){
    const {don_id, product_id} = req.body;
    if ( don_id === undefined || product_id === undefined){
        res.status(400).end();
        return;
    }

    const donProductController = await DonProductController.getInstance();
    const donProduct = await donProductController.create({
        don_id,
        product_id
    });

    if (donProduct != null){
        res.status(201);
        res.json(donProduct)
    }else{
        res.status(409).end();
    }
});

donProductRouter.get("/all", async function(req, res){
    const donProductController = await DonProductController.getInstance();
    const donProduct = await donProductController.getAll();

    if (donProduct != null){
        res.status(200);
        res.json(donProduct);
    }else{
        res.status(204).end();
    }
});

donProductRouter.get("/all/:don_id", async function(req, res){
    const {don_id} = req.params;

    if (!isNumeric(don_id)){
        res.status(409).end();
        return;
    }

    const donProductController = await DonProductController.getInstance();
    const donProduct = await donProductController.getAllByDon( Number.parseInt(don_id) );

    if (donProduct != null){
        res.status(200);
        res.json(donProduct);
    }else{
        res.status(204).end();
    }
})

donProductRouter.get("/one/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const donProductController = await DonProductController.getInstance();
    const donProduct = await donProductController.getOneById( Number.parseInt(id) );

    if (donProduct != null){
        res.status(200);
        res.json(donProduct);
    }else{
        res.status(204).end();
    }
});

donProductRouter.get("/one/:don_id/:product_id", async function(req, res){
    const {don_id, product_id} = req.params;
    if (!isNumeric(don_id) || !isNumeric(product_id)){
        res.status(409).end();
        return;
    }

    const donProductController = await DonProductController.getInstance();
    const donProduct = await donProductController.getOneByProps(
        Number.parseInt(don_id),
        Number.parseInt(product_id)
    );

    if (donProduct != null){
        res.status(200);
        res.json(donProduct);
    }else{
        res.status(204).end();
    }
});

donProductRouter.put("/", async function (req, res){
    const {id, don_id, product_id} = req.body;
    if (id === undefined || don_id === undefined || product_id === undefined){
        res.status(400).end();
        return;
    }

    const donProductController = await DonProductController.getInstance();
    const donProduct = await donProductController.update({
        id,
        don_id,
        product_id
    });

    if (donProduct != null){
        res.status(201);
        res.json(donProduct)
    }else{
        res.status(409).end();
    }
});

donProductRouter.delete("/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const donProductController = await DonProductController.getInstance();
    const affectedRows = await donProductController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    donProductRouter
}
