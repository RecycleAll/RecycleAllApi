import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
} from "sequelize";

export interface DonProductProps {
    id: number;
    don_id?: number;
    product_id?: number;
}

export interface DonProductCreationProps extends Optional<DonProductProps, "id"> {}

export interface DonProductInstance extends Model<DonProductProps, DonProductCreationProps>, DonProductProps {

}

export default function(sequelize: Sequelize): ModelCtor<DonProductInstance> {
    return sequelize.define<DonProductInstance>("DonProduct", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        don_id: {
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
