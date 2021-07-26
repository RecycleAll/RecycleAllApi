import express from "express";
import validator from "validator";
import isNumeric = validator.isNumeric;
import {UserAddressController} from "../controllers/userAddress.controller";

const userAddressRouter = express.Router();

userAddressRouter.post("/", async function (req, res){
    const {user_id, address_id} = req.body;
    if ( user_id === undefined || address_id === undefined){
        res.status(400).end();
        return;
    }

    const userAddressController = await UserAddressController.getInstance();
    const userAddress = await userAddressController.create({
        user_id,
        address_id
    });

    if (userAddress != null){
        res.status(201);
        res.json(userAddress)
    }else{
        res.status(409).end();
    }
});

userAddressRouter.get("/all", async function(req, res){
    const userAddressController = await UserAddressController.getInstance();
    const userAddress = await userAddressController.getAll();

    if (userAddress != null){
        res.status(200);
        res.json(userAddress);
    }else{
        res.status(204).end();
    }
});

userAddressRouter.get("/all/:user_id", async function(req, res){
    const {user_id} = req.params;

    if (!isNumeric(user_id)){
        res.status(409).end();
        return;
    }

    const userAddressController = await UserAddressController.getInstance();
    const userAddress = await userAddressController.getAllByUser( Number.parseInt(user_id) );

    if (userAddress != null){
        res.status(200);
        res.json(userAddress);
    }else{
        res.status(204).end();
    }
})

userAddressRouter.get("/one/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const userAddressController = await UserAddressController.getInstance();
    const userAddress = await userAddressController.getOneById( Number.parseInt(id) );

    if (userAddress != null){
        res.status(200);
        res.json(userAddress);
    }else{
        res.status(204).end();
    }
});

userAddressRouter.get("/one/:user_id/:address_id", async function(req, res){
    const {user_id, address_id} = req.params;
    if (!isNumeric(user_id) || !isNumeric(address_id)){
        res.status(409).end();
        return;
    }

    const userAddressController = await UserAddressController.getInstance();
    const userAddress = await userAddressController.getOneByProps(
        Number.parseInt(user_id),
        Number.parseInt(address_id)
    );

    if (userAddress != null){
        res.status(200);
        res.json(userAddress);
    }else{
        res.status(204).end();
    }
});

userAddressRouter.put("/", async function (req, res){
    const {id, user_id, address_id} = req.body;
    if (id === undefined || user_id === undefined || address_id === undefined){
        res.status(400).end();
        return;
    }

    const userAddressController = await UserAddressController.getInstance();
    const userAddress = await userAddressController.update({
        id,
        user_id,
        address_id
    });

    if (userAddress != null){
        res.status(200);
        res.json(userAddress)
    }else{
        res.status(409).end();
    }
});

userAddressRouter.delete("/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const userAddressController = await UserAddressController.getInstance();
    const affectedRows = await userAddressController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    userAddressRouter
}
