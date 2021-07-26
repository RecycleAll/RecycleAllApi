import express from "express";


const coinRouter = express.Router();


coinRouter.get("/", async function (req, res){
    let j = {
        ratio:0.1
    }

    res.status(200);
    res.json(j);
});

export {
    coinRouter
}
