import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
} from "sequelize";

export interface MediaProductProps {
    id: number;
    media_id?: number;
    product_id?: number;
}

export interface MediaProductCreationProps extends Optional<MediaProductProps, "id"> {}

export interface MediaProductInstance extends Model<MediaProductProps, MediaProductCreationProps>, MediaProductProps {

}

export default function(sequelize: Sequelize): ModelCtor<MediaProductInstance> {
    return sequelize.define<MediaProductInstance>("MediaProduct", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        media_id: {
            type: DataTypes.BIGINT,
        },
        product_id: {
            type: DataTypes.BIGINT,
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
