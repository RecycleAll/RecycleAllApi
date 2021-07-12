import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
} from "sequelize";

export interface SendProps {
    id: number;
    date: Date;
    send_type: number;
    status: number;
    delivery_address?: number;
}

export interface SendCreationProps extends Optional<SendProps, "id"> {}

export interface SendInstance extends Model<SendProps, SendCreationProps>, SendProps {

}

export default function(sequelize: Sequelize): ModelCtor<SendInstance> {
    return sequelize.define<SendInstance>("send", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE,
        },
        send_type: {
            type: DataTypes.BIGINT,
        },
        status: {
            type: DataTypes.BIGINT,
        },
        delivery_address: {
            type: DataTypes.BIGINT,
        },
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
