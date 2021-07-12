import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
} from "sequelize";

export interface DonProps {
    id: number;
    date: Date;
    coins_win?: number;
    user_id?: number;
}

export interface DonCreationProps extends Optional<DonProps, "id"> {}

export interface DonInstance extends Model<DonProps, DonCreationProps>, DonProps {

}

export default function (sequelize: Sequelize): ModelCtor<DonInstance> {
    return sequelize.define<DonInstance>("don", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE,
        },
        coins_win: {
            type: DataTypes.BIGINT,
        },
        user_id: {
            type: DataTypes.BIGINT,
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
