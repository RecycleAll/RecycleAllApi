import express from "express";
import {MediaController} from "../controllers/media.controller";
import validator from "validator";
import isNumeric = validator.isNumeric;
import {FileController} from "../controllers/file.controller";
import multer from "multer";
import * as fs from "fs";

const mediaRouter = express.Router();
// const storage = FileController.getInstance().getStorage();
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         // callback(null, process.env.PATH_FOLDER)
//         callback(null, "C:/_DEV/_0_PA/data/")
//     },
//     filename: (req, file, callback) => {
//         // const {id} = req.body;
//         callback(null, file.filename)
//     }
// });
// const upload = multer({storage: storage});

const UPLOAD_PATH = "C:/_DEV/_0_PA/data/";
const upload = multer({ dest: `${UPLOAD_PATH}`});

mediaRouter.post("/", async function(req, res){
    const {name, path, client_view, media_type_id, user_save} = req.body;

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
    res.send(req.file);
});

mediaRouter.get('/file/:id', async function (req, res){
    const {id} = req.params;
    const path = "C:\\_DEV\\_0_PA\\data\\fdac9994b84bd28978a926cb97e2cf61";

    res.setHeader('Content-Type', "image/jpeg");
    fs.createReadStream(path).pipe(res);
})

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
    const {id, name, path, client_view, media_type_id, user_save} = req.body;

    if ( id === undefined ) {
        res.status(400).end();
        return;
    }

    const mediaController = await MediaController.getInstance();
    const media = await mediaController.update({
        id,
        name,
        path,
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
