import {ModelCtor} from "sequelize";
import {ProductCreationProps, ProductInstance, ProductProps} from "../models/product.model";
import {EntrepotInstance} from "../models/entrepot.model";
import {SequelizeManager} from "../models";
import {DonInstance} from "../models/don.model";
import {OrderedProductInstance} from "../models/orderedProduct.model";

export class ProductController{

    Product: ModelCtor<ProductInstance>;
    Entrepot: ModelCtor<EntrepotInstance>;
    Don: ModelCtor<DonInstance>

    private static instance: ProductController;

    public static async getInstance(): Promise<ProductController> {
        if (ProductController.instance === undefined){
            const {Product, Entrepot, Don} = await SequelizeManager.getInstance();
            ProductController.instance = new ProductController(Product, Entrepot, Don);
        }
        return ProductController.instance;
    }

    private constructor(Product: ModelCtor<ProductInstance>, Entrepot: ModelCtor<EntrepotInstance>, Don: ModelCtor<DonInstance>) {
        this.Product = Product;
        this.Entrepot = Entrepot;
        this.Don = Don;
    }

    public async create(props: ProductCreationProps): Promise<ProductInstance | null>{
        if (props.piece_of != undefined){
            const piece = await this.Product.findOne({
                where: {
                    id: props.piece_of
                }
            });
            if (piece == null){
                return null;
            }
        }

        if (props.entrepot_store_id != undefined){
            const entrepot = await this.Entrepot.findOne({
                where: {
                    id: props.entrepot_store_id
                }
            });
            if (entrepot == null){
                return null;
            }
        }

        if (props.don_id != undefined){
            const don = await  this.Don.findOne({
                where: {
                    id: props.don_id
                }
            })
        }

        return this.Product.create( props );
    }

    public async getAll(): Promise<ProductInstance[] | null>{
        return this.Product.findAll();
    }

    public async getOne(id: number): Promise<ProductInstance | null>{
        return this.Product.findOne({
            where: {
                id
            }
        });
    }

    public async update(props: ProductProps): Promise<ProductInstance | null> {
        if (props.piece_of != undefined){
            const piece = await this.Product.findOne({
                where: {
                    id: props.piece_of
                }
            });
            if (piece == null){
                return null;
            }
        }

        if (props.entrepot_store_id != undefined){
            const entrepot = await this.Entrepot.findOne({
                where: {
                    id: props.entrepot_store_id
                }
            });
            if (entrepot == null){
                return null;
            }
        }

        if (props.don_id != undefined){
            const don = await this.Don.findOne({
                where: {
                    id: props.don_id
                }
            });
            if (don == null){
                return null;
            }
        }

        const product = await ProductController.instance.getOne( props.id );
        if (product != null){
            return product.update( props );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const product = await ProductController.instance.getOne( id );
        if (product != null){
            return this.Product.destroy({
                where: {
                    id
                }
            });
        }
        return 0;
    }

    public async getAllByDon(don_id: any): Promise<ProductInstance[] | null> {
        return this.Product.findAll({where : {don_id}});
    }
}
