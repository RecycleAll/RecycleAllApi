import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
} from "sequelize";

export interface EntrepotProps {
    id: number;
    isAtelier: boolean;
    name: string;
    address_id?: number;
}

export interface EntrepotCreationProps extends Optional<EntrepotProps, "id"> {}

export interface EntrepotInstance extends Model<EntrepotProps, EntrepotCreationProps>, EntrepotProps {

}

export default function (sequelize: Sequelize): ModelCtor<EntrepotInstance> {
    return sequelize.define<EntrepotInstance>("entrepot", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        isAtelier: {
            type: DataTypes.BOOLEAN
        },
        name: {
            type: DataTypes.STRING,
        },
        address_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
