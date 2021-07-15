import {ModelCtor} from "sequelize";
import {UserAddressCreationProps, UserAddressInstance, UserAddressProps} from "../models/userAddress.model";
import {UserInstance} from "../models/user.model";
import {AddressInstance} from "../models/address.model";
import {SequelizeManager} from "../models";

export class UserAddressController{

    UserAddress: ModelCtor<UserAddressInstance>;
    User: ModelCtor<UserInstance>;
    Address: ModelCtor<AddressInstance>;

    private static instance: UserAddressController;

    public static async getInstance(): Promise<UserAddressController>{
        if (UserAddressController.instance === undefined){
            const {UserAddress, User, Address} = await SequelizeManager.getInstance();
            UserAddressController.instance = new UserAddressController(UserAddress, User, Address)
        }
        return UserAddressController.instance;
    }

    private constructor(UserAddress: ModelCtor<UserAddressInstance>, User: ModelCtor<UserInstance>, Address: ModelCtor<AddressInstance>) {
        this.UserAddress = UserAddress;
        this.User = User;
        this.Address = Address;
    }

    public async create(props: UserAddressCreationProps): Promise<UserAddressInstance | null>{
        const User = await this.User.findOne({ where: { id: props.user_id } });
        if (User == null){
            return null;
        }
        const Address = await this.Address.findOne({ where: { id: props.address_id } });
        if (Address == null){
            return null;
        }
        return this.UserAddress.create( props );
    }

    public async getOneById(id: number): Promise<UserAddressInstance | null>{
        return this.UserAddress.findOne({
            where: { id }
        });
    }

    public async getOneByProps(user_id: number, address_id: number): Promise<UserAddressInstance | null>{
        return this.UserAddress.findOne({
            where: {
                user_id,
                address_id,
            }
        });
    }

    public async getAll(): Promise<UserAddressInstance[] | null>{
        return this.UserAddress.findAll();
    }

    public async getAllByUser(user_id: number): Promise<UserAddressInstance[] | null>{
        return this.UserAddress.findAll({ where : { user_id }});
    }

    public async update(props: UserAddressProps): Promise<UserAddressInstance | null>{
        if (
            props.address_id === undefined ||
            props.user_id === undefined
        ){
            return null;
        }

        const user = await this.User.findOne({ where: { id: props.user_id } });
        if (user == null){
            return null;
        }
        const address = await this.Address.findOne({ where: { id: props.address_id } });
        if (address == null){
            return null;
        }

        const userAddress = await UserAddressController.instance.getOneById( props.id );
        if (userAddress != null){
            return userAddress.update( props );
        }
        return null;
    }

    public async delete(id: number): Promise<number>{
        const UserAddress = await UserAddressController.instance.getOneById( id );
        if (UserAddress != null){
            return this.UserAddress.destroy({
                where: { id }
            });
        }
        return 0;
    }
}
