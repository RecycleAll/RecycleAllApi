import express from "express";
import {AuthController} from "../controllers/auth.controller";
import {authMiddleware} from "../middlewares/auth.middlewares";
import validator from "validator";
import isNumeric = validator.isNumeric;

const authRouter = express.Router()

authRouter.post("/register", async function(req, res){
    const {firstname, lastname, email, password, work_in} = req.body;

    if (
        firstname === undefined ||
        lastname === undefined ||
        email === undefined ||
        password === undefined
    ) {
        res.status(400).end();
        return;
    }

    const authController = await AuthController.getInstance();
    const user = await authController.register({
        firstname,
        lastname,
        email,
        password,
        recycle_coins: 0,
        work_in,
    });

    if (user != null){
        res.status(201);
        res.json(user);
    }else{
        res.status(409).end();
    }
});

authRouter.post("/subscribe", async function(req, res){
    const {firstname, lastname, email, password} = req.body;

    if (
        firstname === undefined ||
        lastname === undefined ||
        email === undefined ||
        password === undefined
    ) {
        res.status(400).end();
        return;
    }

    const authController = await AuthController.getInstance();
    const user = await authController.subscribe({
        firstname,
        lastname,
        email,
        password,
        recycle_coins: 0,
    });

    if (user != null){
        res.status(201);
        res.json(user);
    }else{
        res.status(409).end();
    }
});

authRouter.post("/login", async function (req, res){
    const {email, password} = req.body;
    if(email === undefined || password === undefined) {
        res.status(400).end();
        return;
    }

    const authController = await AuthController.getInstance();
    const session = await authController.login(email, password);

    if (session !== null){
        res.status(201);
        res.json(session);
    } else {
        res.status(404).end();
        return;
    }
});

authRouter.delete("/logout", authMiddleware, async function (req, res){
    const auth = req.headers["authorization"];
    if (auth !== undefined) {
        const token = auth.slice(7);
        const authController = await AuthController.getInstance();
        const affectedRows = await authController.logout(token);

        if (affectedRows > 0){
            res.status(200).end();
        } else {
            res.status(401).end();
        }
    }
    res.status(400).end();
});

authRouter.get("/", async function (req, res){
    const authController = await AuthController.getInstance();
    const user = await authController.getAll();

    if (user != null){
        res.status(200);
        res.json(user);
    }else{
        res.status(204).end();
    }
});

authRouter.get("/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const authController = await AuthController.getInstance();
    const user = await authController.getOne( Number.parseInt(id) );

    if (user != null){
        res.status(200);
        res.json(user);
    }else{
        res.status(204).end();
    }
});

authRouter.put("/", async function(req, res){
    const {id, firstname, lastname, email, password, recycle_coins, work_in} = req.body;
    if (id === undefined ) {
        res.status(400).end();
        return;
    }
    const authController = await AuthController.getInstance();
    const user = await authController.update({
        id,
        firstname,
        lastname,
        email,
        password,
        recycle_coins,
        work_in,
    });

    if (user != null){
        res.status(200);
        res.json(user);
    }else{
        res.status(400).end();
    }
});

authRouter.delete("/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const authController = await AuthController.getInstance();
    const affectedRows = await authController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    authRouter
}
