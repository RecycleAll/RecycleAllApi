import {ModelCtor} from "sequelize";
import {ProductInstance} from "../models/product.model";
import {SequelizeManager} from "../models";
import {OrderedProductCreationProps, OrderedProductInstance, OrderedProductProps} from "../models/orderedProduct.model";
import {OrderedInstance} from "../models/ordered.model";

export class OrderedProductController{

    OrderedProduct: ModelCtor<OrderedProductInstance>;
    Ordered: ModelCtor<OrderedInstance>;
    Product: ModelCtor<ProductInstance>;

    private static instance: OrderedProductController;

    public static async getInstance(): Promise<OrderedProductController>{
        if (OrderedProductController.instance === undefined){
            const {OrderedProduct, Ordered, Product} = await SequelizeManager.getInstance();
            OrderedProductController.instance = new OrderedProductController(OrderedProduct, Ordered, Product)
        }
        return OrderedProductController.instance;
    }

    private constructor(OrderedProduct: ModelCtor<OrderedProductInstance>, Ordered: ModelCtor<OrderedInstance>, Product: ModelCtor<ProductInstance>) {
        this.OrderedProduct = OrderedProduct;
        this.Ordered = Ordered;
        this.Product = Product;
    }

    public async create(props: OrderedProductCreationProps): Promise<OrderedProductInstance | null>{
        const Ordered = await this.Ordered.findOne({ where: { id: props.ordered_id } });
        if (Ordered == null){
            return null;
        }
        const product = await this.Product.findOne({ where: { id: props.product_id } });
        if (product == null){
            return null;
        }
        return this.OrderedProduct.create( props );
    }

    public async getOneById(id: number): Promise<OrderedProductInstance | null>{
        return this.OrderedProduct.findOne({
            where: { id }
        });
    }

    public async getOneByProps(ordered_id: number, product_id: number): Promise<OrderedProductInstance | null>{
        return this.OrderedProduct.findOne({
            where: {
                ordered_id,
                product_id,
            }
        });
    }

    public async getAll(): Promise<OrderedProductInstance[] | null>{
        return this.OrderedProduct.findAll();
    }

    public async getAllByOrdered(ordered_id: number): Promise<OrderedProductInstance[] | null>{
        return this.OrderedProduct.findAll({ where : { ordered_id }});
    }

    public async update(props: OrderedProductProps): Promise<OrderedProductInstance | null>{
        if (
            props.product_id === undefined ||
            props.ordered_id === undefined
        ){
            return null;
        }

        const ordered = await this.Ordered.findOne({ where: { id: props.ordered_id } });
        if (ordered == null){
            return null;
        }
        const product = await this.Product.findOne({ where: { id: props.product_id } });
        if (product == null){
            return null;
        }

        const orderedProduct = await OrderedProductController.instance.getOneById( props.id );
        if (orderedProduct != null){
            return orderedProduct.update( props );
        }
        return null;
    }

    public async delete(id: number): Promise<number>{
        const OrderedProduct = await OrderedProductController.instance.getOneById( id );
        if (OrderedProduct != null){
            return this.OrderedProduct.destroy({
                where: { id }
            });
        }
        return 0;
    }
}
