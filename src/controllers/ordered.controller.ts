import {ModelCtor} from "sequelize";
import {OrderedCreationProps, OrderedInstance, OrderedProps} from "../models/ordered.model";
import {UserInstance} from "../models/user.model";
import {AddressInstance} from "../models/address.model";
import {SendInstance} from "../models/send.model";
import {SequelizeManager} from "../models";
import {ProductInstance} from "../models/product.model";

export class OrderedController{
    Ordered: ModelCtor<OrderedInstance>;
    Address: ModelCtor<AddressInstance>;
    User: ModelCtor<UserInstance>;
    Send: ModelCtor<SendInstance>;
    Product: ModelCtor<ProductInstance>;

    private static instance: OrderedController;

    public static async getInstance(): Promise<OrderedController>{
        if (OrderedController.instance === undefined){
            const {Ordered,Address,User,Send,Product} = await SequelizeManager.getInstance();
            OrderedController.instance = new OrderedController(Ordered, Address,User,Send,Product);
        }
        return OrderedController.instance;
    }

    private constructor(Ordered: ModelCtor<OrderedInstance>, Address: ModelCtor<AddressInstance>, User: ModelCtor<UserInstance>, Send: ModelCtor<SendInstance>, Product: ModelCtor<ProductInstance>) {
        this.Ordered = Ordered;
        this.Address = Address;
        this.User = User;
        this.Send = Send;
        this.Product = Product;
    }

    public async create(props: OrderedCreationProps): Promise<OrderedInstance | null>{
        const address = await this.Address.findOne({
            where: {
                id: props.billing_address
            }
        });
        if (address == null){
            return null;
        }

        const user = await this.User.findOne({
            where: {
                id: props.user_id
            }
        });
        if (user == null){
            return null;
        }

        if (props.send_id != undefined){
            const send = await this.Send.findOne({
                where: {
                    id: props.send_id
                }
            });
            if (send == null){
                return null;
            }
        }

        return this.Ordered.create( props );
    }

    public async getAll():Promise<OrderedInstance[] | null>{
        return this.Ordered.findAll();
    }

    public async getOne(id: number): Promise<OrderedInstance | null>{
        return this.Ordered.findOne({
            where: {
                id
            }
        })
    }

    public async getAllByUser(user_id: number): Promise<OrderedInstance[] | null>{
        return this.Ordered.findAll({
            where: {
                user_id
            }
        });
    }

    public async update(props: OrderedProps): Promise<OrderedInstance | null>{
        if (props.billing_address != undefined){
            const address = await this.Address.findOne({
                where: {
                    id: props.billing_address
                }
            });
            if (address == null){
                return null;
            }
        }

        if (props.user_id != undefined){
            const user = await this.User.findOne({
                where: {
                    id: props.user_id
                }
            });
            if (user == null){
                return null;
            }
        }

        if (props.send_id != undefined){
            const send = await this.Send.findOne({
                where: {
                    id: props.send_id
                }
            });
            if (send == null){
                return null;
            }
        }

        const ordered = await OrderedController.instance.getOne( props.id );
        if (ordered != null){
            return ordered.update( props );
        }

        return null;
    }

    public async delete(id: number): Promise<number>{
        const ordered = await OrderedController.instance.getOne( id );
        if (ordered != null){
            const count = await this.Ordered.destroy({
                where: {
                    id
                }
            });

            const products = await this.Product.update({
                order_id: undefined
            }, {
                where: {
                    order_id: id
                }
            });

            return count;
        }
        return 0;
    }


}
