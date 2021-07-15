import express from "express";
import {EntrepotController} from "../controllers/entrepot.controller";
import validator from "validator";
import isNumeric = validator.isNumeric;

const entrepotRouter = express.Router();

entrepotRouter.post("/", async function (req, res){
    const {isAtelier, name, address_id} = req.body;
    if (
        isAtelier === undefined ||
        name === undefined ||
        address_id === undefined
    ) {
        res.status(400).end();
        return;
    }

    const entrepotController = await EntrepotController.getInstance();
    const entrepot = await entrepotController.create({
        isAtelier,
        name,
        address_id
    });

    if (entrepot != null){
        res.status(201);
        res.json(entrepot);
    }else{
        res.status(409).end();
    }
});

entrepotRouter.get("/", async function (req, res){
    const entrepotController = await EntrepotController.getInstance();
    const entrepots = await entrepotController.getAll();

    if (entrepots != null){
        res.status(200);
        res.json(entrepots)
    }else{
        res.status(204).end();
    }
});

entrepotRouter.get("/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const entrepotController = await EntrepotController.getInstance();
    const entrepot = await entrepotController.getOne( Number.parseInt(id) );

    if (entrepot != null){
        res.status(200);
        res.json(entrepot)
    }else{
        res.status(204).end();
    }
});

entrepotRouter.put("/", async function (req, res){
    const {id, isAtelier, name, address_id} = req.body;
    if ( id === undefined ) {
        res.status(400).end();
        return;
    }
    const entrepotController = await EntrepotController.getInstance();
    const entrepot = await entrepotController.update({
        id,
        isAtelier,
        name,
        address_id
    });

    if (entrepot != null){
        res.status(200);
        res.json(entrepot)
    }else{
        res.status(400).end();
    }
});

entrepotRouter.delete("/:id", async function(req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const entrepotController = await EntrepotController.getInstance();
    const affectedRows = await entrepotController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    entrepotRouter
}
