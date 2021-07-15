import {ModelCtor} from "sequelize";
import {UserCreationProps, UserInstance, UserProps} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models";
import {compare, hash} from "bcrypt";
import {EntrepotInstance} from "../models/entrepot.model";

export class AuthController {

    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;
    Entrepot: ModelCtor<EntrepotInstance>;

    private static instance: AuthController;

    public static async getInstance(): Promise<AuthController> {
        if (AuthController.instance === undefined) {
            const {User, Session, Entrepot} = await SequelizeManager.getInstance();
            AuthController.instance = new AuthController(User, Session, Entrepot);
        }
        return AuthController.instance;
    }

    private constructor(User: ModelCtor<UserInstance>, Session: ModelCtor<SessionInstance>, Entrepot: ModelCtor<EntrepotInstance>) {
        this.User = User;
        this.Session = Session;
        this.Entrepot = Entrepot;
    }

    public async register(props: UserCreationProps): Promise<UserInstance | null> {
        if (props.work_in != undefined) {
            const entrepot = await this.Entrepot.findOne({
                where: {
                    id: props.work_in
                }
            });
            if (entrepot == null) {
                return null;
            }
        }
        const passwordHashed = await hash(props.password, 5);
        return this.User.create({
            ...props,
            password: passwordHashed,
            recycle_coins: 0
        })
    }

    // Commun user
    public async subscribe(props: UserCreationProps): Promise<UserInstance | null> {
        if (props.work_in != undefined) {
            return null;
        }
        const passwordHashed = await hash(props.password, 5);
        return this.User.create({
            ...props,
            password: passwordHashed,
            recycle_coins: 0
        })
    }

    public async login(email: string, password: string): Promise<SessionInstance | null> {
        const user = await this.User.findOne({
            where: {
                email
            }
        });

        if (user === null) {
            return null;
        }

        const isSamePassword = await compare(password, user.password);
        if (!isSamePassword) {
            return null;
        }

        let session = await this.checkSession(user);
        if (session != null) {
            return session;
        }

        const token = await hash(Date.now() + email, 5);
        session = await this.Session.create({
            token
        });

        await session.setUser(user);
        return session;
    }

    public async checkSession(user: UserInstance): Promise<SessionInstance | null> {
        return this.Session.findOne({
            where: {
                user_id: user.id
            }
        });
    }

    public async getSession(token: string): Promise<SessionInstance | null> {
        return this.Session.findOne({
            where: {
                token
            }
        });
    }

    public async logout(token: string): Promise<number> {
        return this.Session.destroy(
            {
                where: {
                    token: token
                }
            }
        );
    }

    public async getAll(): Promise<UserInstance[] | null> {
        return this.User.findAll();
    }

    public async getOne(id: number): Promise<UserInstance | null> {
        return this.User.findOne({
            where: {
                id
            }
        });
    }

    public async update(props: UserProps): Promise<UserInstance | null> {

        if (props.work_in != undefined) {
            const entrepot = await this.Entrepot.findOne({
                where: {
                    id: props.work_in
                }
            });
            if (entrepot == null) {
                return null;
            }
        }

        const user = await AuthController.instance.getOne(props.id);
        if (user != null) {

            if (props.password != undefined) {
                props.password = await hash(props.password, 5);
            }
            return user.update( props );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const user = await AuthController.instance.getOne(id);
        if (user != null) {
            return this.User.destroy(
                {
                    where: {
                        id: user.id
                    }
                }
            );
        }
        return 0;
    }

}
