import express from "express";
import {MediaController} from "../controllers/media.controller";
import validator from "validator";
import isNumeric = validator.isNumeric;
import multer from "multer";
import * as fs from "fs";

const mediaRouter = express.Router();

const UPLOAD_PATH = process.env.PATH_FOLDER;
const upload = multer({ dest: `${UPLOAD_PATH}`});

mediaRouter.post("/", async function(req, res){
    const {name, path, mimetype, client_view, media_type_id, user_save} = req.body;

    if (
        name === undefined ||
        client_view === undefined ||
        media_type_id === undefined ||
        user_save === undefined
    ) {
        res.status(400).end();
        return;
    }

    const mediaController = await MediaController.getInstance();
    const media = await mediaController.create({
        name,
        path,
        mimetype,
        client_view,
        media_type_id,
        user_save,
    });

    if (media != null){
        res.status(201);
        res.json(media);
    }else{
        res.status(409).end();
    }
});

mediaRouter.post("/file", upload.single('uploaded_file'), async function (req, res){
    // console.log(req.file, req.body);
    console.log("File : ", req.file);
    console.log("Body : ", req.body);
    console.log("ID : ", req.body.id);
    // console.log("", req.)

    const {id, name, client_view, media_type_id, user_save} = req.body;

    if (req.file?.path === undefined && req.file?.mimetype === undefined){
        res.status(409).end();
        return;
    }

    const mediaController = await MediaController.getInstance();
    const media = await mediaController.update({
        id,
        name,
        path: req.file.path,
        mimetype: req.file.mimetype,
        client_view,
        media_type_id,
        user_save
    });

    if (media != null){
        res.status(200);
        res.json(media);
    } else {
        res.status(400).end();
    }
});

mediaRouter.get('/file/:id', async function (req, res){

    const {id} = req.params;
    const mediaController = await MediaController.getInstance();
    const media = await mediaController.getOne( Number.parseInt(id) );

    if (media === null){
        res.status(204).end();
        return;
    }

    const path: string | undefined = media.path;

    if (path === undefined || media.mimetype === undefined){
        res.status(409).end();
        return;
    }

    res.setHeader('Content-Type', media.mimetype);
    fs.createReadStream(path).pipe(res);
});

mediaRouter.get("/", async function(req, res){
    const mediaController = await MediaController.getInstance();
    const medias = await mediaController.getAll();

    if (medias != null){
        res.status(200);
        res.json(medias);
    }else{
        res.status(204).end();
    }
});

mediaRouter.get("/ids", async function (req, res){
    const {ids} = req.body;

    const mediaController = await MediaController.getInstance();
    const medias = await mediaController.getAllByIds(ids);

    if (medias != null){
        res.status(200);
        res.json(medias);
    }else{
        res.status(409).end();
    }
});

mediaRouter.get("/:id", async function(req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const mediaController = await MediaController.getInstance();
    const media = await mediaController.getOne( Number.parseInt(id) );

    if (media != null){
        res.status(200);
        res.json(media);
    }else{
        res.status(204).end();
    }
});

mediaRouter.put("/", async function (req, res){
    const {id, name, path, mimetype, client_view, media_type_id, user_save} = req.body;

    if ( id === undefined ) {
        res.status(400).end();
        return;
    }

    const mediaController = await MediaController.getInstance();
    const media = await mediaController.update({
        id,
        name,
        path,
        mimetype,
        client_view,
        media_type_id,
        user_save,
    });

    if (media != null){
        res.status(200);
        res.json(media);
    }else{
        res.status(400).end();
    }
});

mediaRouter.delete("/:id", async function (req, res){
    const {id} = req.params;

    if (!isNumeric(id)){
        res.status(409).end();
        return;
    }

    const mediaController = await MediaController.getInstance();
    const affectedRows = await mediaController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    mediaRouter
}
