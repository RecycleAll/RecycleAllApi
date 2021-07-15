import {ModelCtor} from "sequelize";
import {ProductCreationProps, ProductInstance, ProductProps} from "../models/product.model";
import {EntrepotInstance} from "../models/entrepot.model";
import {SequelizeManager} from "../models";

export class ProductController{

    Product: ModelCtor<ProductInstance>;
    Entrepot: ModelCtor<EntrepotInstance>;

    private static instance: ProductController;

    public static async getInstance(): Promise<ProductController> {
        if (ProductController.instance === undefined){
            const {Product, Entrepot} = await SequelizeManager.getInstance();
            ProductController.instance = new ProductController(Product, Entrepot);
        }
        return ProductController.instance;
    }

    private constructor(Product: ModelCtor<ProductInstance>, Entrepot: ModelCtor<EntrepotInstance>) {
        this.Product = Product;
        this.Entrepot = Entrepot;
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











}
