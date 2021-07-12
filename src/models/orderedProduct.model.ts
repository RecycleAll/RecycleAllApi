import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
} from "sequelize";

export interface OrderedProductProps {
    id: number;
    ordered_id?: number;
    product_id?: number;
}

export interface OrderedProductCreationProps extends Optional<OrderedProductProps, "id"> {}

export interface OrderedProductInstance extends Model<OrderedProductProps, OrderedProductCreationProps>, OrderedProductProps {

}

export default function(sequelize: Sequelize): ModelCtor<OrderedProductInstance> {
    return sequelize.define<OrderedProductInstance>("OrderedProduct", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        ordered_id: {
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
