import express from "express";
import {parseDate} from "../utils/date.utils";
import {SendController} from "../controllers/send.controller";
import validator from "validator";
import isNumeric = validator.isNumeric;

const sendRouter = express.Router()

sendRouter.post("/", async function (req, res){
    let {date, send_type, status, delivery_address} = req.body;

    if (
        date === undefined ||
        send_type === undefined ||
        status === undefined ||
        delivery_address === undefined
    ) {
        res.status(400).end();
        return;
    }

    date = parseDate(date);
    if (date == null){
        res.status(409).end();
        return;
    }

    const sendController = await SendController.getInstance();
    const send = await sendController.create({
        date,
        send_type,
        status,
        delivery_address
    });

    if (send != null){
        res.status(201);
        res.json(send);
    }else{
        res.status(409).end();
    }
});

sendRouter.get("/", async function (req, res){
    const sendController = await SendController.getInstance();
    const send = await sendController.getAll();

    if (send != null){
        res.status(200);
        res.json(send);
    }else{
        res.status(204).end();
    }
});

sendRouter.get("/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const sendController = await SendController.getInstance();
    const send = await sendController.getOne( Number.parseInt(id) );

    if (send != null){
        res.status(200);
        res.json(send);
    }else{
        res.status(204).end();
    }
});

sendRouter.put("/", async function (req, res){
    let {id, date, send_type, status, delivery_address} = req.body;

    if ( id === undefined ) {
        res.status(400).end();
        return;
    }

    if (date != undefined){
        date = parseDate(date);
        if (date == null){
            res.status(409).end();
            return;
        }
    }

    const sendController = await SendController.getInstance();
    const send = await sendController.update({
        id,
        date,
        send_type,
        status,
        delivery_address
    });

    if (send != null){
        res.status(200);
        res.json(send);
    }else{
        res.status(400).end();
    }
});

sendRouter.delete("/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const sendController = await SendController.getInstance();
    const affectedRows = await sendController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    sendRouter
}
