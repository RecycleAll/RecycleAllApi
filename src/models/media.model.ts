import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
} from "sequelize";

export interface MediaProps {
    id: number;
    name: string;
    path: string;
    client_view: boolean;
    media_type_id?: number;
    user_save?: number;
}

export interface MediaCreationProps extends Optional<MediaProps, "id"> {}

export interface MediaInstance extends Model<MediaProps, MediaCreationProps>, MediaProps{

}

export default function (sequelize: Sequelize): ModelCtor<MediaInstance> {
    return sequelize.define<MediaInstance>("media", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
        },
        path: {
            type: DataTypes.STRING,
        },
        client_view: {
            type: DataTypes.BOOLEAN,
        },
        media_type_id: {
            type: DataTypes.BIGINT,
        },
        user_save: {
            type: DataTypes.BIGINT,
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
