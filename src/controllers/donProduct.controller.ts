import {ModelCtor} from "sequelize";
import {DonProductCreationProps, DonProductInstance, DonProductProps} from "../models/donProduct.model";
import {DonInstance} from "../models/don.model";
import {ProductInstance} from "../models/product.model";
import {SequelizeManager} from "../models";

export class DonProductController{

    DonProduct: ModelCtor<DonProductInstance>;
    Don: ModelCtor<DonInstance>;
    Product: ModelCtor<ProductInstance>;

    private static instance: DonProductController;

    public static async getInstance(): Promise<DonProductController>{
        if (DonProductController.instance === undefined){
            const {DonProduct, Don, Product} = await SequelizeManager.getInstance();
            DonProductController.instance = new DonProductController(DonProduct, Don, Product)
        }
        return DonProductController.instance;
    }

    private constructor(DonProduct: ModelCtor<DonProductInstance>, Don: ModelCtor<DonInstance>, Product: ModelCtor<ProductInstance>) {
        this.DonProduct = DonProduct;
        this.Don = Don;
        this.Product = Product;
    }

    public async create(props: DonProductCreationProps): Promise<DonProductInstance | null>{
        const don = await this.Don.findOne({ where: { id: props.don_id } });
        if (don == null){
            return null;
        }
        const product = await this.Product.findOne({ where: { id: props.product_id } });
        if (product == null){
            return null;
        }
        return this.DonProduct.create( props );
    }

    public async getOneById(id: number): Promise<DonProductInstance | null>{
        return this.DonProduct.findOne({
            where: { id }
        });
    }

    public async getOneByProps(don_id: number, product_id: number): Promise<DonProductInstance | null>{
        return this.DonProduct.findOne({
            where: {
                don_id,
                product_id,
            }
        });
    }

    public async getAll(): Promise<DonProductInstance[] | null>{
        return this.DonProduct.findAll();
    }

    public async getAllByDon(don_id: number): Promise<DonProductInstance[] | null>{
        return this.DonProduct.findAll({ where : { don_id }});
    }

    public async update(props: DonProductProps): Promise<DonProductInstance | null>{
        if (
            props.product_id === undefined ||
            props.don_id === undefined
        ){
            return null;
        }

        const don = await this.Don.findOne({ where: { id: props.don_id } });
        if (don == null){
            return null;
        }
        const product = await this.Product.findOne({ where: { id: props.product_id } });
        if (product == null){
            return null;
        }

        const donProduct = await DonProductController.instance.getOneById( props.id );
        if (donProduct != null){
            return donProduct.update( props );
        }
        return null;
    }

    public async delete(id: number): Promise<number>{
        const donProduct = await DonProductController.instance.getOneById( id );
        if (donProduct != null){
            return this.DonProduct.destroy({
                where: { id }
            });
        }
        return 0;
    }

}
