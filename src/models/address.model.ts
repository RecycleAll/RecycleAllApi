import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
} from "sequelize";

export interface AddressProps {
    id: number;
    name: string;
    number: string;
    way: string;
    complement_way?: string;
    postal_code: string;
    city: string;
}

export interface AddressCreationProps extends Optional<AddressProps, "id"> {}

export interface AddressInstance extends Model<AddressProps, AddressCreationProps>, AddressProps {

}

export default function(sequelize: Sequelize): ModelCtor<AddressInstance> {
    return sequelize.define<AddressInstance>("address", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
        },
        number: {
            type: DataTypes.STRING,
        },
        way : {
            type: DataTypes.STRING,
        },
        complement_way: {
            type: DataTypes.STRING,
        },
        postal_code: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
