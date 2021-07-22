import multer, {Multer} from "multer";

export class FileController{

    storage: multer.StorageEngine;
    private static instance: FileController;

    private constructor() {
        this.storage = multer.diskStorage({
            destination: (req, file, callback) => {
                // callback(null, process.env.PATH_FOLDER)
                callback(null, "C:/_DEV/_0_PA/data/")
            },
            filename: (req, file, callback) => {
                // const {id} = req.body;
                callback(null, file.filename)
            }
        });
    }

    public static getInstance() {
        if (FileController.instance === undefined){
            FileController.instance = new FileController();
        }
        return FileController.instance;
    }

    public getStorage() {
        return this.storage;
    }
}
