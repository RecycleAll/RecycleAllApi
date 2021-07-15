import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor, Order,
} from "sequelize";

export interface OrderedProps {
    id: number;
    price: number;
    coins_used: number;
    price_after_reduce: number;
    date: Date;
    billing_address?: number;
    user_id?: number;
    send_id?: number;
}

export interface OrderedCreationProps extends Optional<OrderedProps, "id"> {}

export interface OrderedInstance extends Model<OrderedProps, OrderedCreationProps>, OrderedProps {

}

export default function (sequelize: Sequelize): ModelCtor<OrderedInstance> {
    return sequelize.define<OrderedInstance>("ordered", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        price: {
            type: DataTypes.FLOAT,
        },
        coins_used: {
            type: DataTypes.BIGINT,
        },
        price_after_reduce: {
            type: DataTypes.FLOAT,
        },
        date: {
            type: DataTypes.DATE,
        },
        billing_address: {
            type: DataTypes.BIGINT,
        },
        user_id: {
            type: DataTypes.BIGINT,
        },
        send_id: {
            type: DataTypes.BIGINT,
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
