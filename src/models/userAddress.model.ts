import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
} from "sequelize";

export interface UserAddressProps {
    id: number;
    user_id?: number;
    address_id?: number;
}

export interface UserAddressCreationProps extends Optional<UserAddressProps, "id"> {}

export interface UserAddressInstance extends Model<UserAddressProps, UserAddressCreationProps>, UserAddressProps {

}

export default function(sequelize: Sequelize): ModelCtor<UserAddressInstance> {
    return sequelize.define<UserAddressInstance>("userAddress", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT,
        },
        address_id: {
            type: DataTypes.BIGINT,
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
