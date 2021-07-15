import {ModelCtor} from "sequelize";
import {MediaTypeCreationProps, MediaTypeInstance, MediaTypeProps} from "../models/mediaType.model";
import {SequelizeManager} from "../models";
import {EntrepotInstance} from "../models/entrepot.model";

export class MediaTypeController{
    MediaType: ModelCtor<MediaTypeInstance>;

    private static instance : MediaTypeController;

    public static async getInstance(): Promise<MediaTypeController>{
        if (MediaTypeController.instance === undefined){
            const {MediaType} = await SequelizeManager.getInstance();
            MediaTypeController.instance = new MediaTypeController(MediaType);
        }
        return MediaTypeController.instance;
    }

    private constructor(MediaType: ModelCtor<MediaTypeInstance>) {
        this.MediaType = MediaType;
    }

    public async create(props: MediaTypeCreationProps): Promise<MediaTypeInstance | null> {
        return this.MediaType.create( props );
    }

    public async getAll(): Promise<MediaTypeInstance[] | null>{
        return this.MediaType.findAll();
    }

    public async getOne(id: number): Promise<MediaTypeInstance | null>{
        return this.MediaType.findOne({
            where: {
                id
            }
        });
    }

    public async update(props: MediaTypeProps): Promise<MediaTypeInstance | null> {
        const mediaType = await MediaTypeController.instance.getOne( props.id );
        if (mediaType != null){
            return mediaType.update( props );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const mediaType = await MediaTypeController.instance.getOne( id );
        if (mediaType != null){
            return this.MediaType.destroy({
                where: {
                    id
                }
            })
        }
        return 0;
    }

}
