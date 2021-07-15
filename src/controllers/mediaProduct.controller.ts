import {ModelCtor} from "sequelize";
import {ProductInstance} from "../models/product.model";
import {SequelizeManager} from "../models";
import {MediaProductCreationProps, MediaProductInstance, MediaProductProps} from "../models/mediaProduct.model";
import {MediaInstance} from "../models/media.model";

export class MediaProductController{

    MediaProduct: ModelCtor<MediaProductInstance>;
    Media: ModelCtor<MediaInstance>;
    Product: ModelCtor<ProductInstance>;

    private static instance: MediaProductController;

    public static async getInstance(): Promise<MediaProductController>{
        if (MediaProductController.instance === undefined){
            const {MediaProduct, Media, Product} = await SequelizeManager.getInstance();
            MediaProductController.instance = new MediaProductController(MediaProduct, Media, Product)
        }
        return MediaProductController.instance;
    }

    private constructor(MediaProduct: ModelCtor<MediaProductInstance>, Media: ModelCtor<MediaInstance>, Product: ModelCtor<ProductInstance>) {
        this.MediaProduct = MediaProduct;
        this.Media = Media;
        this.Product = Product;
    }

    public async create(props: MediaProductCreationProps): Promise<MediaProductInstance | null>{
        const media = await this.Media.findOne({ where: { id: props.media_id } });
        if (media == null){
            return null;
        }
        const product = await this.Product.findOne({ where: { id: props.product_id } });
        if (product == null){
            return null;
        }
        return this.MediaProduct.create( props );
    }

    public async getOneById(id: number): Promise<MediaProductInstance | null>{
        return this.MediaProduct.findOne({
            where: { id }
        });
    }

    public async getOneByProps(media_id: number, product_id: number): Promise<MediaProductInstance | null>{
        return this.MediaProduct.findOne({
            where: {
                media_id,
                product_id,
            }
        });
    }

    public async getAll(): Promise<MediaProductInstance[] | null>{
        return this.MediaProduct.findAll();
    }

    public async getAllByProduct(product_id: number): Promise<MediaProductInstance[] | null>{
        return this.MediaProduct.findAll({ where : { product_id }});
    }

    public async update(props: MediaProductProps): Promise<MediaProductInstance | null>{
        if (
            props.product_id === undefined ||
            props.media_id === undefined
        ){
            return null;
        }

        const Media = await this.Media.findOne({ where: { id: props.media_id } });
        if (Media == null){
            return null;
        }
        const product = await this.Product.findOne({ where: { id: props.product_id } });
        if (product == null){
            return null;
        }

        const mediaProduct = await MediaProductController.instance.getOneById( props.id );
        if (mediaProduct != null){
            return mediaProduct.update( props );
        }
        return null;
    }

    public async delete(id: number): Promise<number>{
        const MediaProduct = await MediaProductController.instance.getOneById( id );
        if (MediaProduct != null){
            return this.MediaProduct.destroy({
                where: { id }
            });
        }
        return 0;
    }
}
