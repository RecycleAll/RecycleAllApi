import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
} from "sequelize";

export interface UserProps{
    id: number;
    firstname: string;
    lastname: string;
    password: string;
    email: string;
    recycle_coins: number;
    work_in?:number;
}

export interface UserCreationProps extends Optional<UserProps, "id"> {}

export interface UserInstance extends Model<UserProps, UserCreationProps>, UserProps {

}

export default function(sequelize: Sequelize): ModelCtor<UserInstance> {
    return sequelize.define<UserInstance>("user", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        firstname: {
            type: DataTypes.STRING
        },
        lastname: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            // TODO : unique: true
        },
        recycle_coins: {
            type: DataTypes.BIGINT
        },
        work_in: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
