import express from "express";
import {AddressController} from "../controllers/address.controller";
import validator from "validator";
import isNumeric = validator.isNumeric;

const addressRouter = express.Router();

addressRouter.post("/", async function(req, res){
    const {name, number, way, complement_way, postal_code, city} = req.body;

    if (
        name === undefined ||
        number === undefined ||
        way === undefined ||
        postal_code === undefined ||
        city === undefined
    ){
        res.status(400).end();
        return;
    }

    const addressController = await AddressController.getInstance();
    const address = await addressController.create({
        name,
        number,
        way,
        complement_way,
        postal_code,
        city
    });

    if (address != null){
        res.status(201);
        res.json(address);
    }else{
        res.status(409).end();
    }
});

addressRouter.get("/", async function (req, res){
    const addressController = await AddressController.getInstance();
    const addresses = await addressController.getAll();

    if (addresses != null){
        res.status(200);
        res.json(addresses)
    }else{
        res.status(204).end();
    }
});

addressRouter.get("/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const addressController = await AddressController.getInstance();
    const address = await addressController.getOne(Number.parseInt(id));

    if (address != null){
        res.status(200);
        res.json(address);
    }else{
        res.status(204).end();
    }
});

addressRouter.put("/", async function (req, res){
    const {id, name, number, way, complement_way, postal_code, city} = req.body;

    if ( id === undefined ){
        res.status(400).end();
        return;
    }

    const addressController = await AddressController.getInstance();
    const address = await addressController.update({
        id,
        name,
        number,
        way,
        complement_way,
        postal_code,
        city
    });

    if (address != null){
        res.status(200);
        res.json(address);
    }else{
        res.status(400).end();
    }
});

addressRouter.delete("/:id", async function(req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const addressController = await AddressController.getInstance();
    const affectedRows = await addressController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    addressRouter
}
