import express from "express";
import {parseDate} from "../utils/date.utils";
import {DonController} from "../controllers/don.controller";
import validator from "validator";
import isNumeric = validator.isNumeric;

const donRouter = express.Router()

donRouter.post("/", async function(req, res){
    const {date, coins_win, user_id} = req.body;

    if (
        date === undefined ||
        user_id === undefined
    ){
        res.status(400).end();
        return;
    }

    const parsedDate = parseDate(date);
    if (parsedDate == null){
        res.status(400).end();
        return;
    }

    const donController = await DonController.getInstance();
    const don = await donController.create({
        date: parsedDate,
        coins_win,
        user_id
    });

    if (don != null){
        res.status(201);
        res.json(don);
    } else {
        res.status(409).end();
    }
});

donRouter.get("/all", async function (req, res){
    const donController = await DonController.getInstance();
    const dons = await donController.getAll();

    if (dons != null){
        res.status(200);
        res.json(dons);
    }else{
        res.status(204).end();
    }
});

donRouter.get('/one/:id', async function(req,res ){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const donController = await DonController.getInstance();
    const don = await donController.getOne(Number.parseInt(id));

    if (don != null){
        res.status(200);
        res.json(don);
    }else{
        res.status(204).end();
    }
});

donRouter.get('/user/:id', async function(req,res ){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const donController = await DonController.getInstance();
    const don = await donController.getAllByUser(Number.parseInt(id)); //TODO

    if (don != null){
        res.status(200);
        res.json(don);
    }else{
        res.status(204).end();
    }
});

donRouter.put("/", async function (req, res){
    let {id, date, coins_win, user_id} = req.body;

    if ( id === undefined ){
        res.status(400).end();
        return;
    }

    if (date != undefined){
        const parsedDate = parseDate(date);
        if (parsedDate == null){
            res.status(400).end();
            return;
        }
        date = parsedDate;
    }

    const donController = await DonController.getInstance();
    const don = await donController.update({
        id,
        date,
        coins_win,
        user_id
    });

    if (don != null){
        res.status(200);
        res.json(don);
    } else {
        res.status(400).end();
    }
});

donRouter.delete("/:id", async function(req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const donController = await DonController.getInstance();
    const affectedRows = await donController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    donRouter
}
