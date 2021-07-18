import {Dialect, ModelCtor, Sequelize} from "sequelize";

import addressCreator, {AddressInstance} from "./address.model";
import donCreator, {DonInstance} from "./don.model";
import donProductCreator, {DonProductInstance} from "./donProduct.model";
import entrepotCreator, {EntrepotInstance} from "./entrepot.model";
import mediaCreator, {MediaInstance} from "./media.model";
import mediaProductCreator, {MediaProductInstance} from "./mediaProduct.model";
import mediaTypeCreator, {MediaTypeInstance} from "./mediaType.model";
import orderedCreator, {OrderedInstance} from "./ordered.model";
import orderedProductCreator, {OrderedProductInstance} from "./orderedProduct.model";
import productCreator, {ProductInstance} from "./product.model";
import sendCreator, {SendInstance} from "./send.model";
import sessionCreator, {SessionInstance} from "./session.model";
import userCreator, {UserInstance} from "./user.model";
import userAddressCreator, {UserAddressInstance} from "./userAddress.model";

export interface SequelizeManagerProps {
    sequelize: Sequelize;
    Address: ModelCtor<AddressInstance>;
    Don: ModelCtor<DonInstance>;
    DonProduct: ModelCtor<DonProductInstance>;
    Entrepot: ModelCtor<EntrepotInstance>;
    Media: ModelCtor<MediaInstance>;
    MediaProduct: ModelCtor<MediaProductInstance>;
    MediaType: ModelCtor<MediaTypeInstance>;
    Ordered: ModelCtor<OrderedInstance>;
    OrderedProduct: ModelCtor<OrderedProductInstance>;
    Product: ModelCtor<ProductInstance>;
    Send: ModelCtor<SendInstance>;
    Session: ModelCtor<SessionInstance>;
    User: ModelCtor<UserInstance>;
    UserAddress: ModelCtor<UserAddressInstance>;
}

export class SequelizeManager implements SequelizeManagerProps{

    sequelize: Sequelize;
    Address: ModelCtor<AddressInstance>;
    Don: ModelCtor<DonInstance>;
    DonProduct: ModelCtor<DonProductInstance>;
    Entrepot: ModelCtor<EntrepotInstance>;
    Media: ModelCtor<MediaInstance>;
    MediaProduct: ModelCtor<MediaProductInstance>;
    MediaType: ModelCtor<MediaTypeInstance>;
    Ordered: ModelCtor<OrderedInstance>;
    OrderedProduct: ModelCtor<OrderedProductInstance>;
    Product: ModelCtor<ProductInstance>;
    Send: ModelCtor<SendInstance>;
    Session: ModelCtor<SessionInstance>;
    User: ModelCtor<UserInstance>;
    UserAddress: ModelCtor<UserAddressInstance>;

    private static instance?: SequelizeManager

    public static async getInstance(): Promise<SequelizeManager> {
        if (SequelizeManager.instance === undefined) {
            SequelizeManager.instance = await SequelizeManager.initialize();
        }
        return SequelizeManager.instance;
    }

    private static async initialize(): Promise<SequelizeManager> {
        const sequelize = new Sequelize({
            dialect: process.env.DB_DRIVER as Dialect,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: Number.parseInt(process.env.DB_PORT as string)
        });
        await sequelize.authenticate();
        const managerProps: SequelizeManagerProps = {
            sequelize,
            Address: addressCreator(sequelize),
            Don: donCreator(sequelize),
            DonProduct: donProductCreator(sequelize),
            Entrepot: entrepotCreator(sequelize),
            Media: mediaCreator(sequelize),
            MediaProduct: mediaProductCreator(sequelize),
            MediaType: mediaTypeCreator(sequelize),
            Ordered: orderedCreator(sequelize),
            OrderedProduct: orderedProductCreator(sequelize),
            Product: productCreator(sequelize),
            Send: sendCreator(sequelize),
            Session: sessionCreator(sequelize),
            User: userCreator(sequelize),
            UserAddress: userAddressCreator(sequelize)
        };

        SequelizeManager.associate(managerProps);
        await sequelize.sync({
            // force: true //Permet de recréer toutes les tables
        });

        return new SequelizeManager(managerProps);
    }

    private static associate(props: SequelizeManagerProps): void {

        //MediaProduct associations
        props.Media.belongsToMany(props.Product, {
            through: {
                model: props.MediaProduct,
                unique: false
            },
            foreignKey: "media_id"
        });
        props.Product.belongsToMany(props.Media, {
            through: {
                model: props.MediaProduct,
                unique: false
            },
            foreignKey: "product_id"
        });

        //DonProduct associations
        props.Don.belongsToMany(props.Product, {
            through: {
                model: props.DonProduct,
                unique: false
            },
            foreignKey: "don_id"
        });
        props.Product.belongsToMany(props.Don, {
            through: {
                model: props.DonProduct,
                unique: false
            },
            foreignKey: "product_id"
        });

        //OrderedProduct associations
        props.Ordered.belongsToMany(props.Product, {
            through: {
                model: props.OrderedProduct,
                unique: false
            },
            foreignKey: "ordered_id"
        });
        props.Product.belongsToMany(props.Ordered, {
            through: {
                model: props.OrderedProduct,
                unique: false
            },
            foreignKey: "product_id"
        });

        //UserAddress associations
        props.User.belongsToMany(props.Address, {
            through: {
                model: props.UserAddress,
                unique: false
            },
            foreignKey: "user_id"
        });
        props.Address.belongsToMany(props.User, {
            through: {
                model: props.UserAddress,
                unique: false
            },
            foreignKey: "address_id"
        });

        //Association between Media and MediaType
        props.Media.belongsTo(props.MediaType, {
            foreignKey: "media_type_id"
        });
        props.MediaType.hasMany(props.Media, {
            foreignKey: {
                name: "media_type_id",
                allowNull: true
            }
        });

        //Association between User and Media
        props.Media.belongsTo(props.User, {
            foreignKey: "user_save"
        });
        props.User.hasMany(props.Media, {
            foreignKey: {
                name: "user_save",
                allowNull: true
            }
        });

        //Association between Product and Product
        props.Product.belongsTo(props.Product, {
            foreignKey: "piece_of"
        });
        props.Product.hasMany(props.Product, {
            foreignKey: {
                name: "piece_of",
                allowNull: true
            }
        })

        //Association between Product and Entrepot
        props.Product.belongsTo(props.Entrepot, {
            foreignKey: "entrepot_store_id"
        });
        props.Entrepot.hasMany(props.Product, {
            foreignKey: {
                name: "entrepot_store_id",
                allowNull: true
            }
        });

        //Association between Send and Address
        props.Send.belongsTo(props.Address, {
            foreignKey: "delivery_address"
        });
        props.Address.hasOne(props.Send, {
            foreignKey: {
                name: "delivery_address",
                allowNull: true
            }
        });

        //Association between Ordered and Send
        props.Ordered.belongsTo(props.Send, {
            foreignKey: "send_id"
        });
        props.Send.hasOne(props.Ordered, {
            foreignKey: {
                name: "send_id",
                allowNull: true
            }
        });

        //Association between Ordered and Address
        props.Ordered.belongsTo(props.Address, {
            foreignKey: "billing_address"
        });
        props.Address.hasOne(props.Ordered, {
            foreignKey: {
                name: "billing_address",
                allowNull: true
            }
        });

        //Association between Entrepot and Address
        props.Entrepot.belongsTo(props.Address, {
            foreignKey: "address_id"
        });
        props.Address.hasOne(props.Entrepot, {
            foreignKey: {
                name: "address_id",
                allowNull: true
            }
        });

        //Association between Entrepot and User
        props.User.belongsTo(props.Entrepot, {
            foreignKey: "work_in"
        });
        props.Entrepot.hasOne(props.User, {
            foreignKey: {
                name: "work_in",
                allowNull: true
            }
        });

        //Association between User and Ordered
        props.Ordered.belongsTo(props.User, {
            foreignKey: "user_id"
        });
        props.User.hasMany(props.Ordered, {
            foreignKey: {
                name: "user_id",
                allowNull: true
            }
        });

        //Association between User and Don
        props.Don.belongsTo(props.User, {
            foreignKey: "user_id"
        });
        props.User.hasMany(props.Don, {
            foreignKey: {
                name: "user_id",
                allowNull: true
            }
        });

        //Association between User and Session
        props.Session.belongsTo(props.User, {
            foreignKey: "user_id"
        });
        props.User.hasMany(props.Session, {
            foreignKey: {
                name: "user_id",
                allowNull: true
            }
        });
    }

    private constructor(props: SequelizeManagerProps) {
        this.sequelize = props.sequelize;
        this.Address = props.Address;
        this.Don = props.Don;
        this.DonProduct = props.DonProduct;
        this.Entrepot = props.Entrepot;
        this.Media = props.Media;
        this.MediaProduct = props.MediaProduct;
        this.MediaType = props.MediaType;
        this.Ordered = props.Ordered;
        this.OrderedProduct = props.OrderedProduct;
        this.Product = props.Product;
        this.Send = props.Send;
        this.Session = props.Session;
        this.User = props.User;
        this.UserAddress = props.UserAddress;
    }
}

