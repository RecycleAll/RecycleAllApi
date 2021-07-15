import {ModelCtor} from "sequelize";
import {DonCreationProps, DonInstance, DonProps} from "../models/don.model";
import {UserInstance} from "../models/user.model";
import {SequelizeManager} from "../models";

export class DonController{

    Don: ModelCtor<DonInstance>;
    User: ModelCtor<UserInstance>;

    private static instance: DonController;

    public static async getInstance(): Promise<DonController> {
        if (DonController.instance === undefined){
            const {Don, User} = await SequelizeManager.getInstance();
            DonController.instance = new DonController(Don, User);
        }
        return DonController.instance;
    }

    private constructor(Don: ModelCtor<DonInstance>, User: ModelCtor<UserInstance>) {
        this.Don = Don;
        this.User = User;
    }

    public async create(props: DonCreationProps): Promise<DonInstance | null>{
        const user = await this.User.findOne({
            where:{
                id: props.user_id
            }
        });

        if(user == null){
            return null;
        }

        return this.Don.create( props );
    }

    public async getAll(): Promise<DonInstance[] | null>{
        return this.Don.findAll();
    }

    public async getOne(id: number): Promise<DonInstance | null>{
        return this.Don.findOne({
            where: {
                id
            }
        });
    }

    public async update(props: DonProps): Promise<DonInstance | null>{
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

        const don = await DonController.instance.getOne(props.id);
        if (don != null){
            return don.update( props );
        }
        return null;
    }


    public async delete(id: number): Promise<number>{
        const don = await DonController.instance.getOne(id);
        if (don != null){
            return this.Don.destroy({
                where: {
                    id
                }
            });
        }
        return 0;
    }
}
