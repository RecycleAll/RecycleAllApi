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

        if (props.coins_win != undefined){
            await this.addCoins(user, null, props.coins_win);
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

    public async getAllByUser(user_id: number): Promise<DonInstance[] | null>{
        return this.Don.findAll({
            where: {
                user_id
            }
        });
    }

    public async update(props: DonProps): Promise<DonInstance | null>{
        let user;
        if (props.user_id != undefined){
            user = await this.User.findOne({
                where: {
                    id: props.user_id
                }
            });
        }
        if (user == null){
            return null;
        }

        const don = await DonController.instance.getOne(props.id);

        if (props.coins_win !== undefined){
            await this.addCoins(user, don, props.coins_win)
        }

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

    private async addCoins(user: UserInstance, don: DonInstance | null, coins: number) {
        let final_coins = coins;
        if (don !== null && don.coins_win !== undefined ){
            final_coins = coins - don.coins_win;
        }
        await this.User.update({
            recycle_coins: user.recycle_coins + final_coins
        }, {
            where: {
                id: user.id
            }
        });
    }
}
