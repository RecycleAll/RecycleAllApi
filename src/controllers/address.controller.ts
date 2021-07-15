import {ModelCtor} from "sequelize";
import {AddressCreationProps, AddressInstance, AddressProps} from "../models/address.model";
import {SequelizeManager} from "../models";

export class AddressController{

    Address: ModelCtor<AddressInstance>;

    private static instance: AddressController;

    public static async getInstance(): Promise<AddressController> {
        if (AddressController.instance === undefined){
            const {Address} = await SequelizeManager.getInstance();
            AddressController.instance = new AddressController(Address);
        }
        return AddressController.instance;
    }

    constructor(Address: ModelCtor<AddressInstance>) {
        this.Address = Address;
    }

    public async create(props: AddressCreationProps): Promise<AddressInstance | null>{
        return this.Address.create( props );
    }

    public async getAll(): Promise<AddressInstance[] | null>{
        return this.Address.findAll();
    }

    public async getOne(id: number): Promise<AddressInstance | null> {
        return this.Address.findOne({
            where: {
                id
            }
        });
    }

    public async update(props: AddressProps): Promise<AddressInstance | null> {
        const address = await AddressController.instance.getOne(props.id);
        if (address != null){
            return address.update( props );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const address = await AddressController.instance.getOne(id);
        if (address != null){
            return this.Address.destroy({
                where: {
                    id
                }
            });
        }
        return 0;
    }
}
