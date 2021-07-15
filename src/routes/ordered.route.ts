import express from "express";
import {parseDate} from "../utils/date.utils";
import {OrderedController} from "../controllers/ordered.controller";
import validator from "validator";
import isNumeric = validator.isNumeric;

const orderedRouter = express.Router()

orderedRouter.post("/", async function (req, res){
    const {price, coins_used, price_after_reduce, date, billing_address, user_id, send_id} = req.body;

    if (
        price === undefined ||
        coins_used === undefined ||
        price_after_reduce === undefined ||
        date === undefined ||
        billing_address === undefined ||
        user_id === undefined
    ) {
        res.status(400).end();
        return;
    }

    const parsedDate = parseDate(date);
    if (parsedDate == null){
        res.status(400).end();
        return;
    }

    const orderedController = await OrderedController.getInstance();
    const ordered = await orderedController.create({
        price,
        coins_used,
        price_after_reduce,
        date: parsedDate,
        billing_address,
        user_id,
        send_id
    });

    if (ordered != null){
        res.status(201);
        res.json(ordered);
    }else{
        res.status(409).end();
    }
});

orderedRouter.get("/all", async function (req, res){
    const orderedController = await OrderedController.getInstance();
    const ordered = await orderedController.getAll();

    if (ordered != null){
        res.status(200);
        res.json(ordered);
    }else{
        res.status(204).end();
    }
});

orderedRouter.get("/one/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const orderedController = await OrderedController.getInstance();
    const ordered = await orderedController.getOne( Number.parseInt(id) );

    if (ordered != null){
        res.status(200);
        res.json(ordered);
    }else{
        res.status(204).end();
    }
});

orderedRouter.get("/user/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const orderedController = await OrderedController.getInstance();
    const ordered = await orderedController.getAllByUser( Number.parseInt(id) );

    if (ordered != null){
        res.status(200);
        res.json(ordered);
    }else{
        res.status(204).end();
    }
});

orderedRouter.put("/", async function (req, res){
    let {id, price, coins_used, price_after_reduce, date, billing_address, user_id, send_id} = req.body;

    if ( id === undefined ) {
        res.status(400).end();
        return;
    }

    if (date != undefined){
        date = parseDate(date);
        if (date == null){
            res.status(400).end();
            return;
        }
    }

    const orderedController = await OrderedController.getInstance();
    const ordered = await orderedController.update({
        id,
        price,
        coins_used,
        price_after_reduce,
        date,
        billing_address,
        user_id,
        send_id
    });

    if (ordered != null){
        res.status(200);
        res.json(ordered);
    }else{
        res.status(400).end();
    }
});

orderedRouter.delete("/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const orderedController = await OrderedController.getInstance();
    const affectedRows = await orderedController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    orderedRouter
}
