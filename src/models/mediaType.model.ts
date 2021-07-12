import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
} from "sequelize";

export interface MediaTypeProps {
    id: number;
    name: string;
}

export interface MediaTypeCreationProps extends Optional<MediaTypeProps, "id"> {}

export interface MediaTypeInstance extends Model<MediaTypeProps, MediaTypeCreationProps>, MediaTypeProps {

}

export default function(sequelize: Sequelize): ModelCtor<MediaTypeInstance> {
    return sequelize.define<MediaTypeInstance>("mediaType", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
