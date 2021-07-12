import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
} from "sequelize";

export interface SessionProps {
    id: number;
    token: string;
    user_id?: number;
}

export interface SessionCreationProps extends Optional<SessionProps, "id"> {}

export interface SessionInstance extends Model<SessionProps, SessionCreationProps>, SessionProps {

}

export default function(sequelize: Sequelize): ModelCtor<SessionInstance> {
    return sequelize.define<SessionInstance>("session", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING,
            unique: true
        },
        user_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
