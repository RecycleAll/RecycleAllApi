import {ModelCtor} from "sequelize";
import {SendCreationProps, SendInstance, SendProps} from "../models/send.model";
import {AddressInstance} from "../models/address.model";
import {SequelizeManager} from "../models";
import {EntrepotInstance} from "../models/entrepot.model";

export class SendController{

    Send: ModelCtor<SendInstance>;
    Address: ModelCtor<AddressInstance>;

    private static instance: SendController;

    public static async getInstance(): Promise<SendController>{
        if (SendController.instance === undefined){
            const {Send,Address} = await SequelizeManager.getInstance();
            SendController.instance = new SendController(Send, Address);
        }
        return SendController.instance;
    }

    private constructor(Send: ModelCtor<SendInstance>, Address: ModelCtor<AddressInstance>) {
        this.Send = Send;
        this.Address = Address;
    }

    public async create(props: SendCreationProps): Promise<SendInstance | null>{
        const address = await this.Address.findOne({
            where: {
                id: props.delivery_address
            }
        });
        if (address == null){
            return null;
        }

        return this.Send.create( props );
    }

    public async getAll(): Promise<SendInstance[] | null>{
        return this.Send.findAll();
    }

    public async getOne(id: number): Promise<SendInstance | null>{
        return this.Send.findOne({
            where: {
                id
            }
        });
    }

    public async update(props: SendProps): Promise<SendInstance | null>{
        const address = await this.Address.findOne({
            where: {
                id: props.delivery_address
            }
        });
        if (address == null){
            return null;
        }

        const send = await SendController.instance.getOne( props.id );
        if (send != null){
            return send.update(props);
        }
        return null;
    }

    public async delete(id: number): Promise<number>{
        const send = await SendController.instance.getOne( id );
        if (send != null){
            return this.Send.destroy({
                where:{
                    id
                }
            });
        }
        return 0;
    }


}
