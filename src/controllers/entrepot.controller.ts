import {ModelCtor, where} from "sequelize";
import {EntrepotCreationProps, EntrepotInstance, EntrepotProps} from "../models/entrepot.model";
import {SequelizeManager} from "../models";
import {AddressInstance} from "../models/address.model";

export class EntrepotController{
    Entrepot: ModelCtor<EntrepotInstance>;
    Address: ModelCtor<AddressInstance>;

    private static instance: EntrepotController;

    public static async getInstance(): Promise<EntrepotController>{
        if (EntrepotController.instance === undefined){
            const {Entrepot,Address} = await SequelizeManager.getInstance();
            EntrepotController.instance = new EntrepotController(Entrepot, Address);
        }
        return EntrepotController.instance;
    }

    private constructor(Entrepot: ModelCtor<EntrepotInstance>, Address: ModelCtor<AddressInstance>) {
        this.Entrepot = Entrepot;
        this.Address = Address;
    }

    public async create(props: EntrepotCreationProps): Promise<EntrepotInstance | null>{
        const address = await this.Address.findOne({
            where: {
                id: props.address_id
            }
        });

        if (address == null){
            return null;
        }

        return this.Entrepot.create( props );
    }

    public async getAll(): Promise<EntrepotInstance[] | null>{
        return this.Entrepot.findAll();
    }

    public async getOne(id: number): Promise<EntrepotInstance | null>{
        return this.Entrepot.findOne({
            where: {
                id
            }
        });
    }

    public async update(props: EntrepotProps): Promise<EntrepotInstance | null>{
        if (props.address_id != undefined){
            const address = await this.Address.findOne({
                where: {
                    id: props.address_id
                }
            });

            if (address == null){
                return null;
            }
        }
        const entrepot = await EntrepotController.instance.getOne( props.id );
        if (entrepot != null){
            return entrepot.update( props );
        }
        return null;
    }

    public async delete(id: number): Promise<number>{
        const entrepot = await EntrepotController.instance.getOne( id );
        if (entrepot != null){
            return this.Entrepot.destroy({
                where: {
                    id
                }
            });
        }
        return 0;
    }
}
