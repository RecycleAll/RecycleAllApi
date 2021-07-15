import {ModelCtor} from "sequelize";
import {MediaCreationProps, MediaInstance, MediaProps} from "../models/media.model";
import {UserInstance} from "../models/user.model";
import {SequelizeManager} from "../models";
import {MediaTypeInstance} from "../models/mediaType.model";
import {EntrepotInstance} from "../models/entrepot.model";

export class MediaController{

    Media: ModelCtor<MediaInstance>;
    MediaType: ModelCtor<MediaTypeInstance>;
    User: ModelCtor<UserInstance>;

    private static instance: MediaController;

    public static async getInstance(): Promise<MediaController>{
        if (MediaController.instance === undefined){
            const {Media, MediaType, User} = await SequelizeManager.getInstance();
            MediaController.instance = new MediaController(Media, MediaType, User);
        }
        return MediaController.instance;
    }

    private constructor(Media: ModelCtor<MediaInstance>,MediaType: ModelCtor<MediaTypeInstance>, User: ModelCtor<UserInstance>) {
        this.Media = Media;
        this.MediaType = MediaType;
        this.User = User;
    }

    public async create(props: MediaCreationProps): Promise<MediaInstance | null>{
        const mediaType = await this.MediaType.findOne({
            where:{
                id: props.media_type_id
            }
        });
        if (mediaType == null){
            return null;
        }

        const user = await this.User.findOne({
            where: {
                id: props.user_save
            }
        });
        if (user == null){
            return null;
        }

        return this.Media.create( props );
    }

    public async getAll(): Promise<MediaInstance[] | null>{
        return this.Media.findAll();
    }

    public async getOne(id: number): Promise<MediaInstance | null>{
        return this.Media.findOne({
            where: {
                id
            }
        });
    }

    public async update(props: MediaProps): Promise<MediaInstance | null>{
        if (props.media_type_id != undefined){
            const mediaType = await this.MediaType.findOne({
                where:{
                    id: props.media_type_id
                }
            });
            if (mediaType == null){
                return null;
            }
        }

        if (props.user_save != undefined){
            const user = await this.User.findOne({
                where: {
                    id: props.user_save
                }
            });
            if (user == null){
                return null;
            }
        }

        const media = await MediaController.instance.getOne( props.id );
        if (media != null){
            return media.update( props );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const media = await MediaController.instance.getOne( id );
        if (media != null){
            return this.Media.destroy({
                where: {
                    id
                }
            });
        }
        return 0;
    }
}
